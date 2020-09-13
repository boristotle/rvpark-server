'use strict';
const Sequelize = require('sequelize');

module.exports = function (databaseUri) {

    // ----- DATABASE CONNECTION -----

    let connectionOptions = {
        dialect: 'postgres',
        // logging: console.log,
        logging: false,
        pool: {
            max: 10,
            min: 1,
            idle: 10000,
            ssl: true,
            acquire: 60000
        },
        // dialectOptions: {
        //     ssl: true
        // }
    };

    const db = new Sequelize(databaseUri, connectionOptions);

    return db;
};