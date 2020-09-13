require('./set-config');

const db = require('../../services/data');
db.sync()
    .then(function () {
        console.log("Connected to DB and Synced");
        db.close().then(console.log("Database closed."));
    })
    .catch(function (err) {
        console.error(err);
    });