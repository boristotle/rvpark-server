'use strict';
const Sequelize = require('sequelize');

module.exports = {
    startDate: {
        type: Sequelize.DATE
    },
    endDate: {
        type: Sequelize.DATE
    },
    SiteId: {
        type: Sequelize.INTEGER,
        references: {
            model: "Sites",
            key: "id"
        }
    },
    percentageDiscount: {
        type: Sequelize.FLOAT,
    }
};