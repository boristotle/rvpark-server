const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('GET /api/sponsors', () => {
    it('should fail to get all sponsors without proper authorization', (done) => {
        request(app)
        .get('/api/sponsors')
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

describe('POST /api/sponsors', () => {
    it('should fail to create a sponsor without proper authorization', (done) => {
        request(app)
        .post('/api/sponsors')
        .set('Content-Type',  'application/json')
        .send({ name: 'Pharma Company Name' })
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

describe('GET /api/sponsors/:sponsorId', () => {
    it('should fail to get a single sponsor without proper authorization', (done) => {
        request(app)
        .get('/api/sponsors/2')
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