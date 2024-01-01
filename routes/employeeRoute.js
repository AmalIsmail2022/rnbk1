const express = require('express')
const multer = require("multer");

const {
  getEmployees,
  getEmployee,
  createEmployees,
  updateEmployee,
  deleteEmployee,
  uploadEmployeeImage,
  resizeImage,
} = require("../services/employeeService");
const authService = require("../services/authService")
const router = express.Router()




router
  .route("/")
  .get(getEmployees)
  .post(
    // authService.protect,
    // authService.allowedTo('admin'),
    uploadEmployeeImage,
    resizeImage,
    createEmployees
  );
router
  .route("/:id")
  .get(getEmployee)
  .put(
    // authService.protect,
    // authService.allowedTo("admin"),
    uploadEmployeeImage,
    resizeImage,
    updateEmployee
  )
  .delete(
    // authService.protect,
    // authService.allowedTo("admin"),
    deleteEmployee
  );
module.exports = router