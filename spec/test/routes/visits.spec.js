const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('POST /api/visits/:visitId', () => {
    it('should fail to update a subject visit to reviewed status without proper authorization', (done) => {
        request(app)
        .post('/api/visits/1')
        .set('Content-Type',  'application/json')
        .send()
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

describe('GET /api/visits/studies/:studyId/visits ', () => {
    it('should fail to get study config visits (specifically, for a site) without proper authorization', (done) => {
        request(app)
        .get('/api/visits/studies/1/visits ')
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
