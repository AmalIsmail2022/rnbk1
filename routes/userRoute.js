const express = require("express");
const multer = require("multer");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
} = require("../services/userService");
const authService = require("../services/authService")
const router = express.Router();



router.get("/getme", authService.protect, getLoggedUserData, getUser)
router.put(
  "/changemypassword",
  authService.protect,
  updateLoggedUserPassword,
);
router.put("/updteme", authService.protect, updateLoggedUserData);
router.delete("/deleteme", deleteLoggedUser);

router.put("/changepassword/:id", changeUserPassword);
router.route("/").get(getUsers).post(uploadUserImage, resizeImage, createUser);
router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeImage, updateUser)
  .delete(deleteUser);
module.exports = router;
