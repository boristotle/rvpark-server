'use strict';
const router = require('express').Router();
const db = require('../services/data');
const { Site, Booking, Discount } = db.models;
const op = require('sequelize').Op;
const SECRET_KEY = 'sk_test_51HLYv6AazfTTlzsudZHq6getr2dY3yIk93tRh6ZjiUYhoKCDOUR6Adc2ryW8TsHIgeUvzjwh36dArtFUoc46yFbE007MXNgof6'
const stripe = require("stripe")(SECRET_KEY);
const uuid = require('uuid');
const TAXES = .11;
const _ = require('lodash');
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

        const selectedSite = await Site.findOne({where: { id: req.body.selectedSite.id },
            include: [
                {   model: Discount,
                    required: false,
                    where: { 
                        // do not fetch any discounts greater than 50%
                        percentageDiscount: {[op.lte]: .5},
                        startDate: {[op.lt]: new Date(req.body.checkin)},
                        endDate: {[op.gt]: new Date(req.body.checkout)},
                    }
                }
            ]});

        selectedSite.price = selectedSite.Discounts.length ? (1 - selectedSite.Discounts[0].percentageDiscount * selectedSite.price) : selectedSite.price;
       
        const hours = Math.abs(new Date(req.body.checkin).getTime() - new Date(req.body.checkout).getTime()) / 3600000;
        const numberOfNights = Math.round(hours / 24);

        const savedBooking = await Booking.create({
            numberOfNights,
            totalPrice: numberOfNights * selectedSite.price,
            taxes: (numberOfNights * selectedSite.price) * TAXES,
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
            // console.log('bookingInfo', bookingInfo);

            if (new Date(bookingInfo.startDate) < new Date(new Date().toLocaleDateString('en-US'))) {
                return res.json({
                    availableSites: [],
                    numberOfNights: 0,
                    availableDatesForSites: {}
                 });
            }
   
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


            let numberOfNights = 3;
            if (bookingInfo.endDate) {
                const hours = Math.abs(new Date(bookingInfo.endDate).getTime() - new Date(bookingInfo.startDate).getTime()) / 3600000;
                numberOfNights = Math.round(hours / 24);
            }



            // console.log('bookingsDuringThisTimeFrame', bookingsDuringThisTimeFrame);
            const unavailableSites = bookingsDuringThisTimeFrame.map(b => b.SiteId);
            // console.log('unavailableSites', unavailableSites);

            const availableSites = await Site.findAll({where: { id: {[op.notIn]: unavailableSites}},
                include: [
                    {   model: Discount,
                        required: false,
                        where: { 
                            // do not fetch any discounts greater than 50%
                            percentageDiscount: {[op.lte]: .5},
                            startDate: {[op.lte]: new Date(bookingInfo.startDate)},
                            endDate: {[op.gte]: new Date(bookingInfo.endDate)},
                        }
                    }
                ]}
            );
            // console.log('availablesites', availableSites);

            availableSites.forEach(site => {
                site.price = site.Discounts.length ? (1 - site.Discounts[0].percentageDiscount) * site.price : site.price;
                // console.log('site.price', site.price);
                delete site.dataValues.Discounts;
                return site;
            });

            // if (availableSites.length === 0) {// if none available, find all available sites with a month 
                const bookingsAgg = await Booking.findAll({
                    attributes: ['startDate', 'endDate', 'SiteId'],
                    order : [['SiteId', 'ASC'], ['startDate','ASC']],
                    where: {
                        status: 'confirmed',
                        // startDate: { [op.gt]: new Date(`${new Date().getFullYear()}-01-01T05:00:00.000Z`) },
                        // startDate: { [op.gte]: new Date() },
                        // endDate: { [op.lt]: new Date(`${new Date().getFullYear() + 1}-12-31T05:00:00.000Z`) },
                    }
                });

                // console.log('bookingsAgg', bookingsAgg)

                const data = bookingsAgg.map(b => b.dataValues);

                const datamap = data.reduce((prev, curr) => {
                    if (!prev[curr.SiteId]) {
                        prev[curr.SiteId] = [curr];
                    } else {
                        prev[curr.SiteId].push(curr);
                    }
                    return prev;
                }, {});

                // console.log('datampa', datamap);

                const availableDatesForSites = {};
                // console.log('availableDatesForSites', availableDatesForSites)
                for (const key in datamap) {
                    // console.log('key', key);
                    // console.log('datamap[key]', datamap[key].length);
                    if (datamap[key].length === 1) {
                        const data = datamap[key][0];
                        const SiteId = data.SiteId;
                        const startDate = new Date(data.endDate).toLocaleDateString('en-US');
                        let endDate = new Date(`${new Date().getFullYear()}-12-31T05:00:00.000Z`).toLocaleDateString('en-US');
                        if (new Date(bookingInfo.endDate) > new Date(`${new Date().getFullYear()}-12-31T05:00:00.000Z`)) {
                                endDate = new Date(bookingInfo.endDate).toLocaleDateString();
                        }
                        availableDatesForSites[key] = [{SiteId, startDate, endDate }];
                        // console.log('availableDatesForSites[key]', availableDatesForSites[key])
                    }

                    for (let i = 0; i < datamap[key].length - 1; i++) {
                        // console.log('i1', i);
                        // console.log('key', key);
   
                        // console.log(' datamap[key][i=1]',  datamap[key][i + 1])
                        const data = datamap[key][i];
                        // console.log('data', datamap[key][i + 1]);
                        // console.log('key', key)
                        if (datamap[key][i + 1] && data.endDate < datamap[key][i + 1].startDate) {
                            const SiteId = data.SiteId;
                            const startDate = new Date(data.endDate).toLocaleDateString('en-US');
                            const endDate = new Date(datamap[key][i + 1].startDate).toLocaleDateString('en-US');
                            // console.log('!availableDatesForSites[key]', availableDatesForSites[key])
                            if (!availableDatesForSites[key]) {
                                // console.log('1');
                                availableDatesForSites[key] = [{SiteId, startDate, endDate }];
                            } else {
                                // console.log('2');
                                availableDatesForSites[key].push({SiteId, startDate, endDate });
                            }
                        } 

                        //&& new Date().getFullYear() === new Date(datamap[key][datamap[key].length - 1]).getFullYear()
                        if (i === datamap[key].length - 2) {
                            const SiteId = datamap[key][datamap[key].length - 1].SiteId;
                            let endDate = new Date(`${new Date().getFullYear()}-12-31T05:00:00.000Z`).toLocaleDateString('en-US')
                            const startDate = new Date(datamap[key][datamap[key].length - 1].endDate).toLocaleDateString('en-US');

                            if (new Date(bookingInfo.endDate) > new Date(`${new Date().getFullYear()}-12-31T05:00:00.000Z`) && endDate > bookingInfo.endDate) {
                                endDate = new Date(bookingInfo.endDate).toLocaleDateString('en-US');
                            } 
                            
                            // else if (new Date(bookingInfo.endDate) > new Date(`${new Date().getFullYear()}-12-31T05:00:00.000Z`) && endDate < bookingInfo.endDate) {
                            //     endDate = new Date(`${new Date(bookingInfo.endDate).getFullYear() + 1}-${new Date(bookingInfo.endDate).getMonth() + 1}-${new Date(bookingInfo.endDate).getDay()}-T05:00:00.000Z`).toLocaleDateString('en-US');
                            // }
                        
                            // const endDate = new Date(`${new Date().getFullYear()}-12-31T05:00:00.000Z`).toLocaleDateString('en-US')

                          
                            // if (startDate.getFullYear() > endDate.getFullYear()) {
                            //     return;
                            // }
                            console.log('startdate',startDate)
                            console.log('enddate', endDate);
                            if (new Date(startDate).getFullYear() <= new Date(endDate).getFullYear()) {
                                if (!availableDatesForSites[key]) {
                                    // console.log('3');
                                    availableDatesForSites[key] = [{SiteId, startDate, endDate }];
                                } else {
                                    // console.log('4');
                                    availableDatesForSites[key].push({SiteId, startDate, endDate });
                                }
                            }
     
                        }

                        //TODO: get dates past the current year
                        // if (i === datamap[key].length - 2) {
                        //     console.log('here')
                        //     const data = datamap[key][datamap[key].length - 2];
                        //     console.log('dta', data);
                        //     const SiteId = data.SiteId;
                        //     const startDate = new Date(data.endDate).toLocaleDateString('en-US');
                        //     const endDate = new Date(`${new Date().getFullYear() + 1}-12-31T05:00:00.000Z`).toLocaleDateString('en-US');
                        //     availableDatesForSites[key].push({SiteId, startDate, endDate })
                        // }

                        // console.log('availableDatesForSites', availableDatesForSites);
                    }

                    // console.log('availableDatesForSites[key]6', availableDatesForSites)
  
    
                }

        

            return res.json({
                availableSites: numberOfNights !== 0 ? availableSites : [],
                numberOfNights,
                availableDatesForSites
             });
           
        } catch (err) {
            // console.log('err', err);
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
            const numberOfDaysAvailable = Math.round(hours / 24);
            // console.log('numberOfDaysAvailable', numberOfDaysAvailable)

            let numberOfDaysBooked = 0;
            bookings.forEach((b) => {
                // console.log('b', b);
                const endDate = new Date(b.endDate) > new Date(bookingInfo.endDate) ? bookingInfo.endDate : b.endDate;
                const hours = Math.abs(new Date(endDate).getTime() - new Date(b.startDate).getTime()) / 3600000;
                const numberOfDays = Math.round(hours / 24);
                numberOfDaysBooked += numberOfDays;
            });
            // console.log('numberOfDaysBooked', numberOfDaysBooked);

            // earnings for time frame
            const revenue = bookings.reduce((acc, inc) => acc + inc.totalPrice + inc.taxes, 0);
           
            // occupancy rate for time frame
            const numberOfSites = await Site.count();
            // console.log('numberOfSites', numberOfSites);
            const occupancy = (numberOfDaysBooked / (numberOfSites * numberOfDaysAvailable) * 100).toFixed(2);
            // console.log('numberOfsites',numberOfSites);
            // console.log('numberOfDaysBooked', numberOfDaysBooked)
            // console.log('numberOfDaysAvailable', numberOfDaysAvailable)
            // occupancy = number of sites * number of days / number of days booked
            return res.json({
                timePeriod: `${bookingInfo.startDate} - ${bookingInfo.endDate}`,
                revenue,
                occupancy,
                totalDaysBookedAllSites: numberOfDaysBooked,
                totalDaysAvailableAllSites: numberOfDaysAvailable * numberOfSites,
            });

        } catch (err) {
            return res.json(err);
        }
});

module.exports = router;