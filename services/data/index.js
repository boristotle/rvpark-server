'use strict';
const connectPostgres = require('./connect-postgres');
const configure = require('./configure-models');

let databaseUri = process.env.DATABASE_URI;
let db = connectPostgres(databaseUri);
configure(db);

module.exports = db;