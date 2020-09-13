'use strict';
const dotenv = require('dotenv');
const path = require('path');
const envFilePath = path.join(__dirname, "../envs/", process.env.ENV_FILE);

console.log("Environmental configuration setup started");

if (process.env.ENV_FILE) {
    dotenv.config({path: envFilePath});
    console.log("Environmental configuration setup complete");
} else {
    throw Error("Cannot find config file, did you set one in the environment?");
}

// post setup modifications
require('./set-client-absolute-paths');
require('./set-file-manager-absolute-path');
