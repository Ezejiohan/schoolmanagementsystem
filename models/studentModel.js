const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timeStamps: true
})

const studentModel = mongoose.model('students', studentSchema);
module.exports = studentModel