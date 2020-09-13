const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('GET /api/sites/studies/:studyId/sites', () => {
    it('should fail to get all sites for a study without proper authorization', (done) => {
        request(app)
        .get('/api/sites/studies/1/sites')
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