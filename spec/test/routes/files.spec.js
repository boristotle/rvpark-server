const request = require('supertest');
const express = require('express');
const app = require('../../../app');
const uuidV4 = require('uuid').v4;

describe('GET /api/files/:fileUUID', () => {
    it('should fail to get a file without proper authorization', (done) => {
        request(app)
        .get(`/api/files/${uuidV4()}`)
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