const express = require("express");

const {
  signUp,
  login,
  forgetPassword,
  verifyPassRessCode,
} = require("../services/authService");
  

const router = express.Router();
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgetpassword").post(forgetPassword);
router.route("/verifypassressCode").post(verifyPassRessCode);
module.exports = router;
