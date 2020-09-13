'use strict';

// ----- SET ENV CONFIGS -----
require('./tools/scripts/set-config');

// ----- REQUIRE DEPENDENCIES -----
var cors = require('cors');
const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');

// What kind of Headers to expose on response after request
// on CORS calls
var corsOptions = {
    exposedHeaders: ['token', 'id']
  }

// ----- INITIALIZE THE APP -----
const app = express();

// ----- ADD GZIP COMPRESSION -----
app.use(compression());

// ----- ALLOW CORS ---------
app.use(cors(corsOptions));

// DEFAULT MIDDLEWARE
// serve public static files for server rendered pages
app.use(express.static('public'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.resolve(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '1000mb'}));
app.use(cookieParser());

// Add headers
// http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
// Add headers
app.use(function (req, res, next) {
    
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, cache-control, token, id, device');
    
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        
        res.setHeader('Access-Control-Max-Age', 86400);
        
        // Pass to next layer of middleware
        next();
    });

// compression
app.use(compression());

// some security
app.use(helmet());

// serve angular static files
// app.use(express.static(process.env.CLIENT_AB_ASSETS_PATH));

// ALLOW ACCESS TO INDEX ROUTES BEFORE REQUIRING TOKEN
app.use('/', require('./routes/index'));

// // serve angular static files
app.use(express.static(process.env.CLIENT_AB_ASSETS_PATH));

// ----- ERROR ROUTES -----

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// ----- EXPORT THE APP -----
module.exports = app;