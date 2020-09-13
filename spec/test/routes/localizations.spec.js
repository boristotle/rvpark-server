const request = require('supertest');
const express = require('express');
const app = require('../../../app');

// describe('GET /api/localizations/:subjectId', () => {
//     it('should fail to get all subject localizations without proper authorization', (done) => {
//         request(app)
//         .get('/api/localizations/7')
//         .expect('Content-Type', /json/)
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