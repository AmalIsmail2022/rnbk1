const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail")
const UserModel = require("../models/userModel");
exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create({
    name: req.body.name,
    image: req.body.image,
    password: req.body.password,
    email: req.body.email,
  });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ msg: "invalid email or password" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split("")[1];
  }
  if (!token) {
    return res.status(401).json({ msg: "you are not login" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return res
      .status(401)
      .json({ msg: "the user that belong to this token does no longer exist" });
  }
  if (currentUser.passwordChangeAt) {
    const psswordChangedTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    if (psswordChangedTimestamp > decoded.iat) {
      return res.status(401).json({
        msg: "the user recently changed his password, please login again",
      });
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: "you are not allowed to access this route",
      });
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      msg: `there is no user with this email ${req.body.email}`,
    });
  }
  const resetCode = Math.floor(100000 + Math.random() + 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000
  user.passwordResetVerified = false
  await user.save()
  const message = `Hi ${user.name},\n we received a request to reset the password on your Crud System Account. \n ${resetCode}\n Enter this code to complete the reset.\n Thank You`
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset code (valid for 10 min)",
      message,
    });
  } catch(err) {
    user.passwordResetCode = undefined
    user.passwordResetExpires = undefined
    user.passwordResetVerified = undefined
    await user.save()
     return res.status(500).json({
       msg: 'there is errrrrror ',
     }); 
  }
  

  return res.status(200).json({
    status: 'Success',
    msg: "reset code sent to email"
    
  });

})
exports.verifyPassRessCode = asyncHandler(async (req, res, next) => { 
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: {$gt: Date.now()}
  });
  if (!user) {
     return res.status(401).json({
       msg: "reset code invalid",
     }); 
  }
  user.passwordResetVerified = true
  await user.save()
  return res.status(200).json({
    status: "Success"
  });
})