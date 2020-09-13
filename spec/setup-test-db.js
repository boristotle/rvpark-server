'use strict';
const Sequelize = require('sequelize');
const configure = require('../services/data/configure-models');
// const databaseUri = 'postgres://wvorrtlpaufykb:QrScgIutUFv_OL5HKXawzt7VRp@ec2-54-163-226-121.compute-1.amazonaws.com:5432/ddgv584jagfvll'
const databaseUri = 'postgres://127.0.0.1:5432/dermapix';
const db = new Sequelize(databaseUri, {
    dialect: 'postgres',
    // logging: console.log,
    logging: false,
    pool: {
        max: 10,
        min: 1,
        idle: 10000,
        ssl: true
    },
    // dialectOptions: {
    //     ssl: true  // for heroku test db
    // }
});

configure(db)

function loadDb(sql) {
    return db.query(sql)
        .then((result) => {
            console.log('Data successfully loaded');
        })
        .catch((err) => {
            console.log('Error loading database', err);
        });
}

function syncDb() {
    return db.sync({force: true});
}

module.exports = { loadDb, syncDb }


