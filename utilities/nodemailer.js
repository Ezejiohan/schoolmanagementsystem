const nodemailer = require("nodemailer");

const SendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        services: 'gmail',
        auth: {
            teacher: process.env.TEACHER,
            pass: process.env.APP_PASSWORD
        }
    });

    let mailOptions = {
        from: {
            name: process.env.NAME,
            address: process.env.TEACHER
        },
        to: options.email,
        subject: options.subject,
        text: options.message
    } 
    await transporter.sendMail(mailOptions);
}

module.exports = { SendMail };