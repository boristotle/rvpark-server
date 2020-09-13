'use strict';

const sendEmail = require('../send-email');
const renderEmail = require('../render-email');
const templateName = "password-reset-email";
const subject = "Dermapix: password reset";

module.exports = function (toAddress, newPassword) {
    let emailHtml = renderEmail(templateName, {newPassword: newPassword});
    return sendEmail({to: toAddress, subject: subject, html: emailHtml, password: newPassword});
};