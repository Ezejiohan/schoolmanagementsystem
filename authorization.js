const jwt = require('jsonwebtoken');
const TeacherModel = require("../models/teacherModel");

const authenticate = async (req, res, next) => {
    try {
        // get token from authorization headers
        const hasAuthorization = req.headers.authorization;

        // checking if its not empty
        if (!hasAuthorization) {
            return res.status(400).json({
                message: 'Authorization not found'
            });
        }

        // Split the token from the bearer
        const token = hasAuthorization.split(' ')[1];
        // confirming validity of token
        const decodedToken = jwt.verify(token, 'secretKey');

        // getting teachers through token
        const teacher = await TeacherModel.findById(decodedToken.id);

        // checking if teacher still exist in database
        if (!teacher) {
            return res.status(404).json({
                message: 'Authorization Failed: Teacher not found'
            });
        }

        req.teacher = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.json({
                message: 'Session Timeout'
            })
        }
        res.status(500).json({
            error: error.message
        })


    }
}

module.exports = { authenticate }