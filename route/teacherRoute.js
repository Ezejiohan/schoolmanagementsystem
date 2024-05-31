const express = require("express");
const {
  createTeacher,
  verify,
  makeTeacherAdmin,
  findTeacherExist,
  getTeachers,
  deleteTeacher,
  updateTeacher,
  teacherLogin,
  changePassword,
  forgotPassword,
  resetPassword
} = require("../Controller/teacher");
const { authenticate } = require("../middleware/authenticate");

const route = express.Router();

route.get("/", (req, res) => {
  res.send("School database");
});

route.post("/api/createTeacher", authenticate, createTeacher);
route.get("/api/verify/:id", verify);
route.post("/api/teacherlogin", teacherLogin);
route.patch("/api/teacher/:id", authenticate, makeTeacherAdmin);
route.get("/api/findTeacherExist/:id", authenticate, findTeacherExist);
route.get("/api/getTeachers", authenticate, getTeachers);
route.delete("/api/deleteTeacher/:id", authenticate, deleteTeacher);
route.put("/api/updateTeacher/:id", authenticate, updateTeacher);
route.patch("/api/changePassword", authenticate, changePassword);
route.post("/api/forgotPassword", forgotPassword);
route.patch("/api/teacher/change_password/:id/:token", resetPassword);

module.exports = { route };