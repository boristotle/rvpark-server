'use strict';
const Promise = require('bluebird');
const transporter = require('./transporter');

const defaultValues = require('./default-values');

const setEmailObject = function (emailObject) {
    if (emailObject.from === undefined) {
        emailObject.from = defaultValues.from;
    }
    return {
        to: emailObject.to,
        from: emailObject.from,
        subject: emailObject.subject,
        html: emailObject.html
    }
};

module.exports = function (emailObject) {
    let email = setEmailObject(emailObject);
    console.log("ATTEMPTING TO SEND EMAIL");
    return new Promise(function (resolve, reject) {
            transporter.sendMail(email, function (err, result) {
                if (err) {
                    console.log("THERE IS AN ERROR SENDING THE EMAIL", err);
                    return reject(err);
                } else {
                    console.log("SUCCESS SENDING THE EMAIL");
                    result.password = emailObject.password;
                    return resolve(result);
                }
            });
        }
    );
};

module.exports.callback = function (emailObject, callback) {
    let email = setEmailObject(emailObject);
    transporter.sendMail(email, callback);
};