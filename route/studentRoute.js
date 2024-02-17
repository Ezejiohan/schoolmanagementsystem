const express = require('express');
const { createStudent, studentLogin, getStudents, deleteStudent, updateStudent } = require('../Controller/student');
const { authenticate } = require("../middleware/authenticate");

const studentRoute = express.Router();
studentRoute.get("/", (req, res) => {
    res.send("School database");
})

studentRoute.post("/api/createStudent", authenticate, createStudent);
studentRoute.post("/api/studentlogin", authenticate, studentLogin);
studentRoute.get("/api/getStudents", authenticate, getStudents);
studentRoute.delete("/api/deleteStudent", authenticate, deleteStudent);
studentRoute.put("/api/update", authenticate, updateStudent);

module.exports = { studentRoute }