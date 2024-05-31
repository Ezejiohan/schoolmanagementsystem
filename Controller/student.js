const studentModel = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createStudent = async (req, res) => {
  try {
    const teacher = req.teacher;
    if (teacher.isAdmin === true) {
      res.status(404).json({
        message: "Admin can not create student"
      });
    } 
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword)
    const studentData = {
      teacher: teacher.id,
      fullname: req.body.fullname,
      email: req.body.email,
      age: req.body.age,
      class: req.body.class,
      password: hashPassword,
    };

    const checkStudentExist = await studentModel.findOne({
      email: req.body.email,
    });
    if (checkStudentExist) {
      return res.status(403).json({
        message: "Student already Exist",
      });
    } else {
      const newStudent = await studentModel.create(studentData);
      res.status(200).json({
        message: "Student created successful",
        data: newStudent
      });

    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const studentLogin = async (req, res) => {
  try {
    const loginRequest = {
      email: req.body.email,
      password: req.body.password
    };
    const student = await studentModel.findOne({ email: req.body.email });
    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    } else {
      const correctPassword = bcrypt.compare(req.body.password, student.password)
      if (correctPassword == false) {
        return res.status(401).json({
          message: 'Incorrect email or password'
        });
      } else {
        const generatedToken = jwt.sign({
          id: student._id,
          email: student.email,
        }, "secretKey", { expiresIn: "1hr" });

        const result = {
          id: student._id,
          fullname: student.fullname,
          email: student.email,
          age: student.age,
          class: student.class,
          token: generatedToken
        }

        return res.status(200).json({
          message: 'Login successfully',
          data: result
        });
      }
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const teacher = req.teacher;
    if (!teacher) {
      res.status(404).json({
        message: 'Only teachers can see all students'
      });
    }
      const allStudents = await studentModel.find();

      res.status(200).json({
        status: "Success",
        numberOfStudents: allStudents.length,
        data: allStudents
      });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

const getOneStudent = async (req, res) => {
  try {
    const teacher = req.teacher;
    const student = await studentModel.findById(req.params.id);
    if (!student) {
      res.status(404).json({
        message: 'Student not found'
      })
    } else {
      res.status(200).json({
        status: "Success",
        data: student
      });
    }
    
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) {
      res.status(404).json({
        message: "Student not found"
      });
    } else {
      await studentModel.deleteOne(req.params.id);
      res.status(200).json({
        message: "Student deleted successfully"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const id = req.params.id
    const student = await studentModel.findById(id)
    if (!student) {
      res.status(404).json({
        message: "Student not found"
      });
    } else {
      const studentData = {
        fullname: req.body.fullname,
        email: req.body.email,
        age: req.body.email,
        class: req.body.email
      };
      const updatedStudent = await studentModel.findByIdAndUpdate(id, studentData, { new: true });
      res.status(200).json({
        message: "Student updated successfully",
        data: updatedStudent
      });
    }    
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

module.exports = { createStudent, studentLogin, getStudents, deleteStudent, updateStudent, getOneStudent }