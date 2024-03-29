const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiFeatures = require("../utils/apiFeatures");

const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const EmployeeModel = require("../models/employeeModel");
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/employees")
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1]
//     const filename = `employee-${uuidv4()}-${Date.now()}.${ext}`
//     cb(null, filename);
//   }
// })
const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    res.status(400).json({ msg: "Only Images Allowed" });
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadEmployeeImage = upload.single("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `employee-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 98 })
      .toFile(`../../client/public/employees/${filename}`);
    req.body.image = filename;
  } 
  
  next();
});

// const upload = multer({ storage: multerStorage });

exports.uploadEmployeeImage = upload.single("image");



exports.getEmployees = asyncHandler(async (req, res, next) => {

const documentCounts = await EmployeeModel.countDocuments();
const apiFeatures = new ApiFeatures(EmployeeModel.find(), req.query)
  .paginate(documentCounts)
  .filter()
  .search()
  .sort()
  .limitFields();
   const { mongooseQuery, paginationResult } = apiFeatures;
   const employees = await mongooseQuery;
      res
        .status(200)
        .json({ results: employees.length, paginationResult, data: employees });
})
exports.getEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params
    const employee = await EmployeeModel.findById(id)
    if (!employee) {
        res.status(404).json({msg: `no student found for this id ${id}`})
    }
    res.status(200).json({data:employee})
}

)


exports.createEmployees = asyncHandler (async (req, res) => {
    const name = req.body.name
    const image = req.body.image;
  const age = req.body.age
      const gender = req.body.gender;
    const email = req.body.email
  const phone = req.body.phone
  const position = req.body.position;
    const rating = req.body.rating;
        const employee = await EmployeeModel.create({
          name,
          slug: slugify(name),
          image,
          age,
          gender,
          email,
          phone,
          position,
          rating,
        });
        res.status(201)
        .json({ data: employee })
    
})

exports.updateEmployee = asyncHandler(async (req, res) => {
  if (req.file) {
    const { id } = req.params
    const { name } = req.body
    const { image } = req.body;
    const { age } = req.body
    const { gender } = req.body;
    const { email } = req.body
    const { phone } = req.body
    const { position } = req.body;
    const { rating } = req.body;
    
    
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: id },
      {
        name: name,
        slug: slugify(name),
        image: image,
        age: age,
        gender: gender,
        email: email,
        phone: phone,
        position: position,
        rating: rating,
      },
      { new: true }
    );
  } else {
    const { id } = req.params;
    const { name } = req.body;
    const { image } = req.params;
    const { age } = req.body;
    const { gender } = req.body;
    const { email } = req.body;
    const { phone } = req.body;
    const { position } = req.body;
    const { rating } = req.body;
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: id },
      {
        name: name,
        slug: slugify(name),
        image: image,
        age: age,
        gender: gender,
        email: email,
        phone: phone,
        position: position,
        rating: rating,
      },
      { new: true }
    );
  }
    
     if (!employee) {
        res.status(404).json({msg: `no student found for this id ${id}`})
    }
    res.status(200).json({data:employee})
} 
)

exports.deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params
    const employee = await EmployeeModel.findByIdAndDelete(id)
    if (!employee) {
        res.status(404).json({msg: `no student found for this id ${id}`})
    }
    res.status(204).send()
}
)














