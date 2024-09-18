const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gouravthakur3232@gmail.com',
        pass: 'ffcl thku zljw txgd', // Use environment variables for sensitive data
    },
});

module.exports = transporter;