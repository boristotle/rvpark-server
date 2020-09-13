'use strict';

const sendEmail = require('../send-email');
const renderEmail = require('../render-email');
const templateName = "account-creation-email";
const subject = "Dermapix: Account Activated";

module.exports = function (toAddress, userName, password) {
    let emailHtml = renderEmail(templateName, {userName: userName, password: password});
    return sendEmail({to: toAddress, subject: subject, html: emailHtml});
};