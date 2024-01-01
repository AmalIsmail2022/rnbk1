const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const sharp = require("sharp");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    res.status(400).json({ msg: "Only Images Allowed" });
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadUserImage = upload.single("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `employee-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 98 })
      .toFile(`uploads/users/${filename}`);
    req.body.image = filename;
  }

  next();
});


exports.uploadUserImage = upload.single("image");

exports.getUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const users = await UserModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: users.length, page, data: users });
});

exports.getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    res.status(404).json({ msg: `no student found for this id ${id}` });
  }
  res.status(200).json({ data: user });
});

exports.createUser = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const password = req.body.password;
  const email = req.body.email;
  const role = req.body.role;
  const user = await UserModel.create({
    name,
    slug: slugify(name),
    image,
    password,
    email,
    role,
  });
  res.status(201).json({ data: user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const { id } = req.params;
    const { name } = req.body;
    const { image } = req.body;
    // const { password } = req.body;
    const { email } = req.body;
    const { role } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        name: name,
        slug: slugify(name),
        image: image,
        // password: password,
        email: email,
        role: role,
      },
      { new: true }
    );
  } else {
    const { id } = req.params;
    const { name } = req.body;
    const { image } = req.params;
    // const { password } = req.body;
    const { email } = req.body;
    const { role } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        name: name,
        slug: slugify(name),
        image: image,
        // password: password,
        email: email,
        role: role,
      },
      { new: true }
    );
  }

  if (!user) {
    res.status(404).json({ msg: `no student found for this id ${id}` });
  }
  res.status(200).json({ data: user });
});



exports.changeUserPassword = asyncHandler(async (req, res, next) => {

  
    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          password: await bcrypt.hash(req.body.password, 12),
          passwordChangeAt: Date.now()
        },
        {
            new: true 
        }
    );

  

  if (!user) {
    res.status(404).json({ msg: `no student found for this id ${id}` });
  }
  res.status(200).json({ data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) {
    res.status(404).json({ msg: `no student found for this id ${id}` });
  }
  res.status(204).send();
});


exports.getLoggedUserData = asyncHandler(async (req, res, next) => { 
  req.params.id = req.user._id
  next()
})

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
 
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangeAt: Date.now(),
      },
      {
        new: true,
      }
    );
 const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
   expiresIn: process.env.JWT_EXPIRE_TIME,
 });
    res.status(200).json({ data: user, token });

});
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => { 
  const updateduser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,

    },
    { new: true }
  );
      res.status(200).json({ data: updateduser });

})
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => { 
    await UserModel.findByIdAndUpdate(req.user._id, {active:false})
      res.status(204).send();

})
