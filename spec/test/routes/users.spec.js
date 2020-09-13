const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('GET /api/users', () => {
    it('should fail to get all users without proper authorization', (done) => {
        request(app)
        .get('/api/users')
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


// describe('POST /api/users/bulk', () => {
//     it('should fail to create users in bulk without proper authorization', (done) => {
//         request(app)
//         .post('/api/users/bulk')
//         .set('Content-Type',  'application/json')
//         .send({ })
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

describe('POST /api/users', () => {
    it('should fail to create a user as self without proper authorization', (done) => {
        request(app)
        .post('/api/users')
        .set('Content-Type',  'application/json')
        .send({ firstName: 'Forest', lastName: 'Gump' , email: 'fgump@bubbagumpshrimp.com', title: 'Genius' })
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

describe('POST /api/users/create', () => {
    it('should fail to create a user as another user without proper authorization', (done) => {
        request(app)
        .post('/api/users/create')
        .set('Content-Type',  'application/json')
        .send({ firstName: 'Forest', lastName: 'Gump' , email: 'fgump@bubbagumpshrimp.com', title: 'Genius' })
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

describe('POST /api/users/resetPassword', () => {
    it('should fail to reset a user\'s password without proper authorization', (done) => {
        request(app)
        .post('/api/users/resetPassword')
        .set('Content-Type',  'application/json')
        .send({ userId: 'PLACEHOLDER FOR USER UUID HERE' })
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

describe('POST /api/users/:userId', () => {
    it('should fail to update a user without proper authorization', (done) => {
        request(app)
        .post('/api/users/USER-ID-HERE')
        .set('Content-Type',  'application/json')
        .send({ userName: '', firstName: '', lastName: '', email: '', title: '' })
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

describe('GET /api/users/:userId/profiles', () => {
    it('should fail to get all user profiles without proper authorization', (done) => {
        request(app)
        .get('/api/users/USER-UUID-HERE/profiles')
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

describe('POST /api/users/:userId/profileroles', () => {
    it('should fail to update a user\'s roles and profiles without proper authorization', (done) => {
        request(app)
        .post('/api/users/USER-UUID-HERE/profileroles')
        .set('Content-Type',  'application/json')
        .send({ profiles: [], roles: {} })
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

describe('POST /api/users/:userId/profiles/admin', () => {
    it('should fail to attach the system admin profile to the user without proper authorization', (done) => {
        request(app)
        .post('/api/users/USER-UUID-HERE/profiles/admin')
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

describe('POST /api/users/:userId/profiles/removeadmin', () => {
    it('should fail to remove the system admin profile to the user without proper authorization', (done) => {
        request(app)
        .post('/api/users/USER-UUID-HERE/profiles/removeadmin')
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


describe('GET /api/users/:userId/studyroles', () => {
    it('should fail to get all studies that match user roles without proper authorization', (done) => {
        request(app)
        .get('/api/users/USER-UUID-HERE/studyroles')
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

describe('GET /api/users/:userId/roles', () => {
    it('should fail to get the user\'s roles without proper authorization', (done) => {
        request(app)
        .get('/api/users/USER-UUID-HERE/roles')
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