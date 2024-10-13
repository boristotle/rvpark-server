'use strict';

const Sequelize = require('sequelize');

module.exports = {
    email: {
        type: Sequelize.STRING,
    },
    name: {
        type: Sequelize.STRING,
    },
    phone: {
        type: Sequelize.STRING
    },
    SiteId: {
        type: Sequelize.INTEGER,
        references: {
            model: "Sites",
            key: "id"
        }
    },
    status: {
        type: Sequelize.ENUM,
        values: ['pending', 'confirmed']
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
    totalPrice: {
        type: Sequelize.FLOAT
    },
    taxes: {
        type: Sequelize.FLOAT
    },
    startDate: {
        type: Sequelize.DATE
    },
    endDate: {
        type: Sequelize.DATE
    },
    numberOfNights: {
        type: Sequelize.INTEGER
    }
};