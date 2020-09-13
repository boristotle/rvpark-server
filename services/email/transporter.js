'use strict';
const nodemailer = require('nodemailer');


// Pending smtp configuration

let smtpConfig = {
    host: 'smtp2.blah.com',
    port: 465,
    secure: true,
    authMethod: "ENCRYPTED",
    auth: {
        user: "username",
        pass: "password"
    },
    tls: {
        rejectUnauthorized: false
    }
};


const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;


