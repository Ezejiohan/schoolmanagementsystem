const TeacherModel = require("../models/teacherModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createTeacher = async (req, res) => {
  try {
    const teacher = req.teacher;
    if (teacher.isAdmin === true ) {
      res.status(404).json({
        message: "Teacher can not create teachers"
      });
    }
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    const teacherData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPassword,
    };

    const checkTeacherExist = await TeacherModel.findOne({
      email: req.body.email,
    });
    if (checkTeacherExist) {
      return res.status(403).json({
        message: "Teacher already exist",
      });
    } else {
      const newTeacher = await TeacherModel.create(teacherData);
      return res.status(200).json({
        message: "Teacher created successfully",
        data: newTeacher,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const teacherLogin = async (req, res) => {
  try {
    const loginRequest = {
      email: req.body.email,
      password: req.body.password
    };

    const teacher = await TeacherModel.findOne({ email: req.body.email });
    if (!teacher) {
      return res.status(404).json({
        message: 'Teacher not found'
      })
    } else {
      const correctPassword = bcrypt.compare(req.body.password, teacher.password);
      if (correctPassword == false) {
        return res.status(401).json({
          message: 'Incorrect email or password'
        })
      } else {
        const generatedToken = jwt.sign({
          id: teacher._id,
          email: teacher.email,
          isAdmin: teacher.isAdmin
        }, "secretKey", {expiresIn: "1h"});

        const result = {
          id: teacher._id,
          firstname: teacher.firstname,
          lastname: teacher.lastname,
          email: teacher.email,
          admin: teacher.isAdmin,
          token: generatedToken
        }

        return res.status(200).json({
          message: 'Login successfully',
          data: result
        })
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  };
};

const makeTeacherAdmin = async (req, res) => {
  const teacher = await TeacherModel.findById(req.params.id);
  if (!teacher) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  } else {
    const admin = await TeacherModel.findByIdAndUpdate(teacher._id, {
      isAdmin: true,
    }, {
      new: true
    });
    res.status(200).json({
      message: teacher.firstname + " " + teacher.lastname + " is now an admin",
      data: admin,
    });
  }
};

const findTeacherExist = async (req, res) => {
  const teacher = await TeacherModel.findById(req.params.id);
  if (!teacher) {
    return res.status(404).json({
      message: "Teacher not found"
    });
  } else {
    res.status(200).json({
      message: teacher.firstname + " " + teacher.lastname,
      data: teacher,
    });
  }
}

const getTeachers = async (req, res) => {
  try {
    const allTeachers = await TeacherModel.find();

    res.status(200).json({
      status: "Success",
      numberOfTeachers: allTeachers.length,
      data: allTeachers
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await TeacherModel.findById(req.params.id);
    if (!teacher) {
      res.status(404).json({
        message: "Teacher not found"
      });
    } else {
      await TeacherModel.deleteOne(req.params.id);
      res.status(200).json({
        message: "Teacher deleted successfully"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const id = req.params.id
    const teacher = await TeacherModel.findById(id);
    if (!teacher) {
      res.status(404).json({
        message: "Teacher not found"
      });
    } else {
      const teacherData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
      };  
      const updatedTeacher = await TeacherModel.findByIdAndUpdate(id, teacherData, { new: true});
      res.status(500).json({
        message: "Teacher updated successful",
        data: updatedTeacher
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
}

module.exports = { createTeacher, teacherLogin, makeTeacherAdmin, findTeacherExist, getTeachers, deleteTeacher, updateTeacher };
