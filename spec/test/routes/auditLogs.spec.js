const request = require('supertest');
const express = require('express');
const app = require('../../../app');

const sinon = require('sinon');

const dbSetup = require('../../setup-test-db');
const sqlToInsert = require('../../insert-sql').sql;

const db = require('../../../services/data');
const UserModel = db.models.User;
const jwt = require('jsonwebtoken');

describe('AUDIT LOG ROUTES TESTS', () => {
    let token;
    let user;
    before(async() => {
        await dbSetup.loadDb(sqlToInsert);
        user = await UserModel.findOne({raw: true});
        token = jwt.sign({user: user.id, profiles: user.profiles, roles: user.roles}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_EXP});
    });

    before((done) => { // login is required to access api routes
        request(app)
        .post('/login')
        .send({userName: user.userName, password: 'TestPass123$$'})
        .end((err, res) => {
            done();
        });
    });

    describe('GET /api/auditlogs', () => {
        it('should fail to get all audit logs without proper authorization', (done) => {
            request(app)
            .get('/api/auditlogs')
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

    describe('GET /api/auditlogs after auth', () => {
        it('should get all audit logs', (done) => {
            request(app)
            .get('/api/auditlogs')
            .set('Cookie', [`access_token=${token}`])
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw new Error(err);
                } else {
                    sinon.assert.match(res.body.length, 1);
                    done();
                }
            });
        });
    });
});