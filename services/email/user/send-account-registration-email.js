'use strict';

const sendEmail = require('../send-email');
const renderEmail = require('../render-email');
const templateName = "account-registration-email";
const subject = "Dermapix: New Registration";

module.exports = function (toAddress) {
    let emailHtml = renderEmail(templateName);
    return sendEmail({to: toAddress, subject: subject, html: emailHtml});
};