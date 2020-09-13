'use strict';
const path = require('path');
process.env.CLIENT_AB_APP_PATH = path.resolve(__dirname, "../..", process.env.CLIENT_REL_APP_PATH)
process.env.CLIENT_AB_ASSETS_PATH = path.resolve(__dirname, "../..", process.env.CLIENT_REL_ASSETS_PATH);