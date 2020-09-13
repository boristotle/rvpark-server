const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('GET /api/profiles', () => {
    it('should fail to get all profiles without proper authorization', (done) => {
        request(app)
        .get('/api/profiles')
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

describe('POST /api/profiles/create', () => {
    it('should fail to create a profile without proper authorization', (done) => {
        request(app)
        .post('/api/profiles/create')
        .set('Content-Type',  'application/json')
        .send({ 
            profile: {
                name: 'Study-Coordinator-Study-X',
                StudyId: 9999 
            }
        })
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

describe('POST /api/profiles/delete', () => {
    it('should fail to delete a profile without proper authorization', (done) => {
        request(app)
        .post('/api/profiles/delete')
        .set('Content-Type',  'application/json')
        .send({ profileId: 7 })
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

describe('POST /api/profiles/:profileId', () => {
    it('should fail to update a profile without proper authorization', (done) => {
        request(app)
        .post('/api/profiles/7')
        .set('Content-Type',  'application/json')
        .send({ 
            profile: {
                id: 7,
                name: 'Study-Coordinator-Study-X',
                StudyId: 1,
                permissions: {
                    "everything": {
                        "GET_EVERYTHING": false
                    }
                }
            }
        })
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

describe('GET /api/profiles/:profileId', () => {
    it('should fail to get a single profile without proper authorization', (done) => {
        request(app)
        .get('/api/profiles/7')
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

describe('GET /api/profiles/study/:studyId', () => {
    it('should fail to get all profiles for a study without proper authorization', (done) => {
        request(app)
        .get('/api/profiles/1')
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