const request = require('supertest');
const express = require('express');
const app = require('../../../app');

// describe('POST /api/inquiries/upload/:inquiryId/:commentId', () => {
//     it('should fail to add a file to an inquiry without proper authorization', (done) => {
//         request(app)
//         .post('/api/inquiries/upload/9/4')
//         .set('Content-Type',  'application/json')
//         .send({imageIds: [1]})
//         .expect(401)
//         .end((err, res) => {
//             if (err) {
//                 throw new Error(err);
//             } else {
//                 done();
//             }
//         });
//     });
// });

describe('GET /api/inquiries', () => {
    it('should fail to get all inquiries without proper authorization', (done) => {
        request(app)
        .get('/api/inquiries')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                throw new Error(err);
            } else {
                done();
            }
        });
    });
});

describe('GET /api/inquiries/visit/:visitId', () => {
    it('should fail to get all inquiries for a visit without proper authorization', (done) => {
        request(app)
        .get('/api/inquiries/visit/9999')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                throw new Error(err);
            } else {
                done();
            }
        });
    });
});

describe('GET /api/inquiries/:inquiryId', () => {
    it('should fail to get a single inquiry without proper authorization', (done) => {
        request(app)
        .get('/api/inquiries/7')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                throw new Error(err);
            } else {
                done();
            }
        });
    });
});

describe('POST /api/inquiries', () => {
    it('should fail to create an inquiry without proper authorization', (done) => {
        request(app)
        .post('/api/inquiries')
        .set('Content-Type',  'application/json')
        .send({StudyId: 9999, ConfigSiteId: 1, SubjectId: 9999, VisitId: 9999, inquiryType: 'DCQ', billable: false, comments: 'comment on inquiry here' })
        .expect(401)
        .end((err, res) => {
            if (err) {
                throw new Error(err);
            } else {
                done();
            }
        });
    });
});


describe('POST /api/inquiries/reply', () => {
    it('should fail to comment on an inquiry without proper authorization', (done) => {
        request(app)
        .post('/api/inquiries/reply')
        .set('Content-Type',  'application/json')
        .send({inquiryId: 7, status: 'pending-site', billable: false, comments: 'comment on inquiry here' })
        .expect(401)
        .end((err, res) => {
            if (err) {
                throw new Error(err);
            } else {
                done();
            }
        });
    });
});

describe('POST /api/inquiries/:inquiryId/close', () => {
    it('should fail to close an inquiry without proper authorization', (done) => {
        request(app)
        .post('/api/inquiries/7/close')
        .set('Content-Type',  'application/json')
        .send({billable: true, comments: 'closing inquiry comments'})
        .expect(401)
        .end((err, res) => {
            if (err) {
                throw new Error(err);
            } else {
                done();
            }
        });
    });
});
