'use strict';

// ----- SCHEMAS -----
const SiteSchema = require('./schemas/sites');
const BookingSchema = require('./schemas/bookings');

module.exports = function (db) {

    // ----- MODELS -----
    const SiteModel = db.define('Site', SiteSchema);
    const BookingModel = db.define('Booking', BookingSchema);

    // ----- ASSOCIATIONS -----
    SiteModel.hasMany(BookingModel);
    BookingModel.belongsTo(SiteModel);

    // ----- EXPORT DATABASE -----
    return db;
};
