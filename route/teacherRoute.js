const express = require("express");
const {
  createTeacher,
  makeTeacherAdmin,
  findTeacherExist,
  getTeachers,
  deleteTeacher,
  updateTeacher,
  teacherLogin
} = require("../Controller/teacher");
const { authenticate } = require("../middleware/authenticate");

const route = express.Router();

route.get("/", (req, res) => {
  res.send("School database");
});

route.post("/api/createTeacher", authenticate, createTeacher);
route.post("/api/teacherlogin", teacherLogin);
route.patch("/api/teacher/:id", authenticate, makeTeacherAdmin);
route.get("/api/findTeacherExist/:id", authenticate, findTeacherExist);
route.get("/api/getTeachers", authenticate, getTeachers);
route.delete("/api/deleteTeacher/:id", authenticate, deleteTeacher);
route.put("/api/updateTeacher/:id", authenticate, updateTeacher);


module.exports = { route };
