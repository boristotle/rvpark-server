'use strict';
const path = require('path');
const jade = require('jade');

const templateFolder = path.join(__dirname, "/templates");

module.exports = function (templateName, data) {
    templateName = templateName.concat('.jade');
    const templatePath = path.join(templateFolder, templateName);//"/".concat(templateName));
    return jade.renderFile(templatePath, Object.assign({filename: templatePath, pretty: true}, data));
};