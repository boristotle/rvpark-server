'use strict';

const Sequelize = require('sequelize');

module.exports = {
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    SiteId: {
        type: Sequelize.INTEGER,
        references: {
            model: "Sites",
            key: "id"
        }
    },
    unitType: {
        type: Sequelize.STRING,
    },
    pets: {
        type: Sequelize.INTEGER
    },
    kids: {
        type: Sequelize.INTEGER
    },
    adults: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.INTEGER
    },
    startDate: {
        type: Sequelize.DATE
    },
    endDate: {
        type: Sequelize.DATE
    }
};