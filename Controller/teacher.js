const TeacherModel = require("../models/teacherModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SendMail } = require("../utilities/nodemailer");

const createTeacher = async (req, res) => {
  try {
    const teacher = req.teacher;
    console.log(teacher);
    if (teacher.isAdmin === false ) {
      res.status(403).json({
        message: "Teacher can not create teachers only Admin can" 
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

      const verificationLink = req.protocol + '://' + req.get("host") + "/api/verify/" + newTeacher._id;
      const message = `Thank you for your registration. kindly click this link ${verificationLink} to verify your account`;

      SendMail({
        email: newTeacher.email,
        subject: "Verify your account",
        message
      });
    
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

const verify = async (req, res) => {
  try {
    const teacher = await TeacherModel.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        message: "teacher not found"
      });
    }

    if (teacher.verified === true) {
      return res.status(400).json({
        message: "Teacher already verified"
      });
    }
    teacher.verified = true;
    await teacher.save();

    res.status(200).json({
      message: "Teacher verification Successful",
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
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
      });
    } else {
      const correctPassword = await bcrypt.compare(loginRequest.password, teacher.password);
      if (correctPassword === false) {
        return res.status(401).json({
          message: 'Incorrect email or password'
        })
      } else {
        const generatedToken = jwt.sign({
          id: teacher._id,
          email: teacher.email,
          isAdmin: teacher.isAdmin
        }, process.env.TOKEN, {expiresIn: "1h"});

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
        });
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
    const teacher = req.teacher;
    if (!teacher.isAdmin === true) {
      res.status(404).json({
        message: 'Teachers can not see all teachers'
      });
    }

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
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const teacher = await TeacherModel.findOne({ email: req.teacher.email });
    const comparePassword = await bcrypt.compare(oldPassword, teacher.password);
  
    if (!comparePassword) {
      return res.status(404).json({
        message: "Password Incorrect"
      });
    } 
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    if (newPassword === oldPassword) {
      return res.status(404).json({
        message: "Unauthorized"
      });
    }

    teacher.password = hashPassword;

    SendMail({
      email: teacher.email,
      subject: "password change alert",
      message: "You have change your password. If you are the pls alert us"
    });

    const result = {
      firstnmae: teacher.firstname,
      lastname: teacher.lastname,
      email: teacher.email
    }
    await teacher.save();

    return res.status(200).json({
      message: "Password change successful",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    })
  }
};

const forgotPassword = async (req, res) => {
  try {
    const teacher = await TeacherModel.findOne({ email: req.body.email });
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found"
      });
    }

    const token = jwt.sign({
      id: teacher.id,
      email: teacher.email
    }, process.env.TOKEN)

    const passwordChangeLink = `${req.protocol}://${req.get("host")}/api/teacher/change_password/${teacher._id}/${token}`;
    const message = `Click this link: ${passwordChangeLink} to set a new password`;

    SendMail({
      email: teacher.email,
      subject: "Forgot password link",
      message
    });

    res.status(200).json({
      message: "Email has been sent"
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const teacher = await TeacherModel.findOne({ id: req.params.id });
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(404).json({
        message: "There is difference in both password"
      });
    }

    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    const updatePassword = await TeacherModel.findByIdAndUpdate(req.params.id, {
      password: hashPassword
    });

    res.status(200).json({
      message: "Password changed successfully",
      data: updatePassword
    });

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

module.exports = { createTeacher,
   verify, 
   teacherLogin, 
   makeTeacherAdmin, 
   findTeacherExist, 
   getTeachers,
   changePassword, 
   deleteTeacher,
   forgotPassword,
   resetPassword, 
   updateTeacher };
