'use strict';
const router = require('express').Router();
const db = require('../services/data');
const { Site, Booking } = db.models;
const op = require('sequelize').Op;
const SECRET_KEY = 'sk_test_51IFU8YCfUXRmPJhQ1ipAgwHLIcCMIqXyPyxBLPYkygHfq8oFYNFey6yyuAAtiQQlnGBoPB8uvWVlJXQ0I5rokbik0064PgKYDu'
const stripe = require("stripe")(SECRET_KEY);
const uuid = require('uuid');
// const UserModel = db.models.User;
// const userEmails = require('../services/email').user;
// const dataMethods = require('../services/data-methods');
router.get("/", (req, res) => {
    res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
  });

  
router.post("/payment", async (req, res) => {
    console.log("Request:", req.body);

    let error;
    let status;
    try {
      const { formData, token } = req.body;
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });
  
      const idempotency_key = uuid();
      const charge = await stripe.charges.create(
        {
          amount: formData.totalPrice,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email, // email is not set in client yet
          description: `Purchased site number ${formData.selectedSite.number}`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip
            }
          }
        },
        {
          idempotency_key
        }
      );
      console.log("Charge:", charge);
      status = "success";
    } catch (error) {
      console.error("Error:", error);
      status = "failure";
    }
  
    res.json({ error, status });
});
  

router.post('/available-sites',
    async function(req, res, next) {
        try {
            const bookingInfo = req.body; //{ startDate: 'MM/DD/YYYY', endDate: 'MM/DD/YYYY', type?: 'travel-trailer'}
            // console.log('bookingInfo', bookingInfo);
    
            // to find all bookings for this time frame
            // "startDate": "10/12/2020", unavailable if startDate is greater than bookingInfo.startDate and startDate less than bookingInfo.endDate AND
            // "endDate": "10/12/2020" unavailable if endDate less than bookingInfo.endDate and endDate greater than bookingInfo.startDate
            const bookingsDuringThisTimeFrame = await Booking.findAll({
                where: { 
                    [op.and]: [
                        {
                            startDate: { [op.gt]: new Date(bookingInfo.startDate) },
                            startDate: { [op.lt]: new Date(bookingInfo.endDate) },
                        },
                        {
                            endDate: { [op.lt]: new Date(bookingInfo.endDate) },
                            endDate: { [op.gt]: new Date(bookingInfo.startDate) },
                        }
                    ]
                }
            });

            const hours = Math.abs(new Date(bookingInfo.endDate).getTime() - new Date(bookingInfo.startDate).getTime()) / 3600000;
            const numberOfNights = Math.round(hours / 24);

            // console.log('bookingsDuringThisTimeFrame', bookingsDuringThisTimeFrame);
            const unavailableSites = bookingsDuringThisTimeFrame.map(b => b.SiteId);

            const availableSites = await Site.findAll({where: { id: {[op.notIn]: unavailableSites}}});
    
            return res.json({ availableSites, numberOfNights });
            
        } catch (err) {
            // console.log('err', err);
            return res.json(err);
        }
});

router.post('/book',
    async function(req, res, next) {
        try {
            const booking = req.body;
            //{ "firstName": "Darrin",
            // "lastName": "Bennett",
            // "SiteId": 2,
            // "unitType": "travel trailer",
            // "pets": 6,
            // "kids": 1,
            // "adults": 2,
            // "price": 450.5,
            // "startDate": "10/01/2020",
            // "endDate": "10/11/2020" }

            booking.startDate = new Date(
                booking.startDate.slice(6,10),
                booking.startDate.slice(0,2) - 1,
                booking.startDate.slice(3,5),
                -4,
                0,
                0,
                0
            );

            booking.endDate = new Date(
                booking.endDate.slice(6,10),
                booking.endDate.slice(0,2) - 1,
                booking.endDate.slice(3,5),
                -4,
                0,
                0,
                0
            );

            // TODO:  add a before save hook that checks that the site isn't already booked 
            const savedBooking = await Booking.create(booking);

            return res.json(savedBooking);

        } catch (err) {
            return res.json(err);
        }  
});

router.post('/stats', 
    async function (req, res, next) {
        try {
            const bookingInfo = req.body;
            // Find all bookings between the startDate and endDate
            const bookings = await Booking.findAll({
                where: { 
                    [op.and]: [
                        {
                            startDate: { [op.gt]: new Date(bookingInfo.startDate) },
                            startDate: { [op.lt]: new Date(bookingInfo.endDate) },
                        },
                        {
                            endDate: { [op.lt]: new Date(bookingInfo.endDate) },
                            endDate: { [op.gt]: new Date(bookingInfo.startDate) },
                        }
                    ]
                }
            });

            const hours = Math.abs(new Date(bookingInfo.endDate).getTime() - new Date(bookingInfo.startDate).getTime()) / 3600000;
            const numberOfDaysAvailable = Math.round(hours / 24);
            // console.log('numberOfDaysAvailable', numberOfDaysAvailable)

            let numberOfDaysBooked = 0;
            bookings.forEach((b) => { 
                // console.log('b', b);
                const hours = Math.abs(new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / 3600000;
                const numberOfDays = Math.round(hours / 24);
                numberOfDaysBooked += numberOfDays;
            });
            // console.log('numberOfDaysBooked', numberOfDaysBooked);

            // earnings for time frame
            const income = bookings.reduce((acc, inc) => acc + inc.price, 0);
            
            // occupancy rate for time frame
            const numberOfSites = await Site.count();
            // console.log('numberOfSites', numberOfSites);
            const occupancy = (numberOfDaysBooked / (numberOfSites * numberOfDaysAvailable) * 100).toFixed(2);
            // occupancy = number of sites * number of days / number of days booked
            return res.json({
                timePeriod: `${bookingInfo.startDate} - ${bookingInfo.endDate}`,
                income,
                occupancy
            });

        } catch (err) {
            return res.json(err);
        }
});

module.exports = router;
