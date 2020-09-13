'use strict';
const path = require('path');
const fs = require('fs');


if (process.env.FILE_MANAGER_REL_PATH) {
    process.env.FILE_MANAGER_AB_PATH = path.resolve(__dirname, "../..", process.env.FILE_MANAGER_REL_PATH);
}
