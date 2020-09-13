const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('POST /api/devices/:deviceId/history', () => {
    it('should fail to update device history without proper authorization', (done) => {
        request(app)
        .post('/api/devices/7/history')
        .set('Content-Type',  'application/json')
        .send({id: 1, type: 'Lifeviz Mini', serialNumber: 899998})
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

describe('GET /api/devices/:deviceId/history', () => {
    it('should fail to get device history without proper authorization', (done) => {
        request(app)
        .get('/api/devices/7/history')
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

describe('GET /api/devices', () => {
    it('should fail to get all devices without proper authorization', (done) => {
        request(app)
        .get('/api/devices')
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

describe('GET /api/device/:deviceId', () => {
    it('should fail to get a single device without proper authorization', (done) => {
        request(app)
        .get('/api/device/7')
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

describe('POST /api/devices', () => {
    it('should fail to create a device without proper authorization', (done) => {
        request(app)
        .post('/api/devices')
        .set('Content-Type',  'application/json')
        .send({type: 'Lifeviz Mini', serialNumber: 899998})
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

describe('POST /api/devices/:deviceId', () => {
    it('should fail to update a device without proper authorization', (done) => {
        request(app)
        .post('/api/devices/7')
        .set('Content-Type',  'application/json')
        .send({id: 1, type: 'Lifeviz Mini', serialNumber: 899998, storageLocation: 'QCSA'})
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