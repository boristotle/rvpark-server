const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('GET /api/subjects/studies/:studyId/sites/:configSiteId/subjects', () => {
    it('should fail to get all subjects and visits for single site without proper authorization', (done) => {
        request(app)
        .get('/api/subjects/studies/1/sites/1/subjects')
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

describe('POST /api/subjects/studies/:studyId/sites/:configSiteId/subjects', () => {
    it('should fail to create a subject and subject visits without proper authorization', (done) => {
        request(app)
        .post('/api/subjects/studies/1/sites/1/subjects')
        .set('Content-Type',  'application/json')
        .send({ code: 'Subject-001', type: 'real' })
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

describe('GET /api/subjects/studies/:studyId/sites/:configSiteId/subjects/:subjectId/grid', () => {
    it('should fail to populate and configure the subject grid without proper authorization', (done) => {
        request(app)
        .get('/api/subjects/studies/1/sites/1/subjects/1/grid')
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