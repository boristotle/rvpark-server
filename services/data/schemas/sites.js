'use strict';
const Sequelize = require('sequelize');

module.exports = {
    number: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.FLOAT
    }
};