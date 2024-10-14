'use strict';

// ----- SCHEMAS -----
const SiteSchema = require('./schemas/sites');
const BookingSchema = require('./schemas/bookings');
const DiscountSchema = require('./schemas/discount');


module.exports = function (db) {

    // ----- MODELS -----
    const SiteModel = db.define('Site', SiteSchema);
    const BookingModel = db.define('Booking', BookingSchema);
    const DiscountModel = db.define('Discount', DiscountSchema);

    // ----- ASSOCIATIONS -----
    SiteModel.hasMany(BookingModel);
    BookingModel.belongsTo(SiteModel);
    SiteModel.hasMany(DiscountModel);
    DiscountModel.belongsTo(SiteModel);

    // ----- EXPORT DATABASE -----
    return db;
};
