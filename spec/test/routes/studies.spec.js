const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('GET /api/studies/created', () => {
    it('should fail to get all created studies without proper authorization', (done) => {
        request(app)
        .get('/api/studies/created')
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

describe('GET /api/studies', () => {
    it('should fail to get all studies without proper authorization', (done) => {
        request(app)
        .get('/api/studies')
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

