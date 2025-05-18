const nodemailer = require('nodemailer');

async function sendEmail(toEmail, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'superwmslogistic@gmail.com', 
            pass: 'omkt pmgj ksbh oquf'
        }
    });

    let mailOptions = {
        from: 'superwmslogistic@gmail.com',
        to: toEmail,
        subject: subject,
        text: text
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail