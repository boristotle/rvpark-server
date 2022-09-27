'use strict';
const router = require('express').Router();
const db = require('../services/data');
const { Site, Booking } = db.models;
const op = require('sequelize').Op;
const SECRET_KEY = 'sk_test_51IFU8YCfUXRmPJhQyv3BfCsM1y8voRKyZ1k8B2TRQ9yljVIfDOwMkrUZcl6CnS2ap8ijDrTLyPnaQppYLXHiK2Vf00C7UzgZC8'
const stripe = require("stripe")(SECRET_KEY);
const uuid = require('uuid');
const TAXES = .11;
// const UserModel = db.models.User;
// const userEmails = require('../services/email').user;
// const dataMethods = require('../services/data-methods');
router.get("/", (req, res) => {
    res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
  });


router.post("/payment", async (req, res) => {
    // console.log("Request:", req.body);
        // checkin: '5/25/2021',
        // checkout: '5/31/2021',
        // numberOfNights,
        // selectedSite:
        //     {
        //         id: 1,
        //         number: 1,
        //         price: 45,
        //         createdAt: '2020-08-23T12:39:01.141Z',
        //         updatedAt: '2020-08-23T12:39:01.141Z'
        //     }
        // }

    try {
        // checks that the site isn't already booked
        const isSiteBooked = await Booking.findAll({
            where: {
                status: 'confirmed',
                SiteId: req.body.selectedSite.id,
                [op.and]: [
                    {
                        startDate: { [op.gt]: new Date(req.body.checkin) },
                        startDate: { [op.lt]: new Date(req.body.checkout) },
                    },
                    {
                        endDate: { [op.lt]: new Date(req.body.checkout) },
                        endDate: { [op.gt]: new Date(req.body.checkin) },
                    }
                ]
            }
        });

        if (isSiteBooked && isSiteBooked.length > 0) {
            res.status = 400;
            return res.json({error: 'Site has just been booked. Please select a different site.'})
        }
       
        const savedBooking = await Booking.create({
            numberOfNights: req.body.numberOfNights,
            totalPrice: req.body.numberOfNights * req.body.selectedSite.price,
            taxes: (req.body.numberOfNights * req.body.selectedSite.price) * TAXES,
            status: 'pending',
            startDate: new Date(req.body.checkin).toLocaleDateString('en-US'),
            endDate: new Date(req.body.checkout).toLocaleDateString('en-US'),
            SiteId: req.body.selectedSite.id
        });
        return res.json(savedBooking);
    } catch (error) {
        console.log('error', error);
        res.status = 400;
        return res.json({status: 'failure', error: error.message});
    }
});

router.get('/booking/:id', async (req, res) => {
    const booking = await Booking.findOne({where: { id: +req.params.id }});
    return res.json(booking);
});
 

 
router.put("/payment/:id", async (req, res) => {
    const id = +req.params.id;
    // bookingData in payment route: {
        // name: 'Darrin Bennett',
        // phone: '877-444-3432,
        // adults: 1,
        // email: 'boristotle@hotmail.com',
        // kids: 0,
        // pets: 0,
        // totalPrice: 299.7,
        // taxes: 29.7,
        // startDate: '5/25/2021',
        // endDate: '5/31/2021',
        // unitType: 'motorhome-towing',
        // numberOfNights,

    try {
        const { bookingData, token } = req.body;
        // checks that the site isn't already booked
        const isSiteBooked = await Booking.findAll({
            where: {
                status: 'confirmed',
                SiteId: bookingData.SiteId,
                [op.and]: [
                    {
                        startDate: { [op.gt]: new Date(bookingData.startDate) },
                        startDate: { [op.lt]: new Date(bookingData.endDate) },
                    },
                    {
                        endDate: { [op.lt]: new Date(bookingData.endDate) },
                        endDate: { [op.gt]: new Date(bookingData.startDate) },
                    }
                ]
            }
        });

        if (isSiteBooked && isSiteBooked.length > 0) {
            res.status = 400;
            return res.json({error: 'Site has just been booked. Please select a different site.'})
        }

        const customer = await stripe.customers.create({
            email: bookingData.email,
            source: token.id
        });
 
        const total = Math.round((bookingData.totalPrice + bookingData.taxes) * 100);
        const idempotencyKey = uuid();
        const charge = await stripe.charges.create(
            {
            amount: total,
            currency: 'usd',
            customer: customer.id,
            receipt_email: bookingData.email,
            description: `Purchased campsite ${bookingData.SiteId} for ${bookingData.numberOfNights} nights`,
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
            idempotencyKey
            }
        );
       

        const booking = await Booking.update({
                name: bookingData.name,
                email: bookingData.email,
                phone: bookingData.phone,
                status:'confirmed'
            },
                {where: { id }}
            );

        return res.json({status: 'success', booking});
    } catch (error) {
        console.log('error', error);
      res.status = 400;
      return res.json({status: 'failure', error: error.message});
    }
});
 

router.post('/available-sites',
    async function(req, res, next) {
        try {
            const bookingInfo = req.body; //{ startDate: 'MM/DD/YYYY', endDate: 'MM/DD/YYYY', type?: 'travel-trailer'}
            console.log('bookingInfo', bookingInfo);
   
            // to find all bookings for this time frame
            // "startDate": "10/12/2020", unavailable if startDate is greater than bookingInfo.startDate and startDate less than bookingInfo.endDate AND
            // "endDate": "10/12/2020" unavailable if endDate less than bookingInfo.endDate and endDate greater than bookingInfo.startDate
            const bookingsDuringThisTimeFrame = await Booking.findAll({
                where: {
                    status: 'confirmed',
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
            // console.log('unavailableSites', unavailableSites);

            const availableSites = await Site.findAll({where: { id: {[op.notIn]: unavailableSites}}});

            // if (availableSites.length === 0) {// if none available, find all available sites with a month 
                const bookingsAgg = await Booking.findAll({
                    attributes: ['startDate', 'endDate', 'SiteId'],
                    order : [['SiteId', 'ASC'],['startDate','ASC']],
                    where: {
                        status: 'confirmed',
                    }
                });

                const data = bookingsAgg.map(b => b.dataValues)
                // .reduce((prev, curr) => {
                //     return prev;
                // }, {});
                // const NUMBER_OF_SITES = 2;

                // for (let i = 1; i <= NUMBER_OF_SITES; i++) {
                //     data.unshift({SiteId: i, startDate: new Date('2022-01-01T04:00:00.000Z'), endDate: new Date('2022-01-01T04:00:00.000Z')});
                //     data.push({SiteId: i, startDate: new Date('2022-12-31T04:00:00.000Z'), endDate: new Date('2022-12-31T04:00:00.000Z')});
                // }
                const dataClone = data.slice();

                let numberOfAdds = 0;
                data.forEach((d, idx) => {
                    if (idx === 0) {
                        dataClone.splice(idx, 0, {SiteId: d.SiteId, startDate: new Date('2022-01-01T04:00:00.000Z'), endDate: new Date('2022-01-01T04:00:00.000Z')});
                        numberOfAdds += 1;
                    } else if (data[idx + 1] && data[idx].SiteId !== data[idx + 1].SiteId) {
                        numberOfAdds += 1;
                        // numberOfAdds += 2;
                        // ADD DEC 31 to end of each site availability
                        dataClone.splice(idx + numberOfAdds, 0, {SiteId: data[idx - 1].SiteId, startDate: new Date('2022-12-31T04:00:00.000Z'), endDate: new Date('2022-12-31T04:00:00.000Z')});
                        
                        numberOfAdds += 1;// ADD JAN 1 to front of each site availability
                        dataClone.splice(idx + numberOfAdds, 0, {SiteId: data[idx + 1].SiteId, startDate: new Date('2022-01-01T04:00:00.000Z'), endDate: new Date('2022-01-01T04:00:00.000Z')});
                    } else if (!data[idx + 1]) {// if final index
                        dataClone.splice(dataClone.length, 0, {SiteId: data[idx - 1].SiteId, startDate: new Date('2022-12-31T04:00:00.000Z'), endDate: new Date('2022-12-31T04:00:00.000Z')});

                    }


                });
                // console.log('data', data);
                console.log('dataClone', dataClone);

                const availableDates = dataClone.reduce((prev, curr, idx) => {
                    if (!prev[curr.SiteId]) {
                        prev[curr.SiteId] = [];
                    } else {
                        prev[curr.SiteId].push(
                            {startDate: dataClone[idx - 1].endDate, endDate: curr.startDate}
                        )
                    }
                    return prev;

                }, {});

                console.log('availableDates', availableDates);

            return res.json({ availableSites, numberOfNights });
           
        } catch (err) {
            console.log('err', err);
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