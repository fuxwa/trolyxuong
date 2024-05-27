const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config()
const EMAIL_CONFIG = {
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
    }
};
const transporter = nodemailer.createTransport(smtpTransport(EMAIL_CONFIG));

const Email = {
    sendMail(mailOptions) {
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error(error);
                throw error;
            }
        });
    }
}


module.exports = Email;