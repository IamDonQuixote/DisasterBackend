const transporter = require('../config/emailConfig');

const sendEmailAlert = (to, subject, htmlContent) => {
    const mailOptions = {
        from: 'gouravthakur3232@gmail.com',
        to,
        subject,
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = {
    sendEmailAlert,
};