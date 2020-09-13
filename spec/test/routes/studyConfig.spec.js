const request = require('supertest');
const express = require('express');
const app = require('../../../app');
const uuidV4 = require('uuid').v4;

// describe('POST /api/studyconfig/uploadThumbnail', () => {
//     it('should fail to upload a thumbnail image without proper authorization', (done) => {
//         request(app)
//         .post('/api/studyconfig/uploadThumbnail')
//         .set('Content-Type',  'application/json')
//         .send()
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

describe('POST /api/studyconfig/request', () => {
    it('should fail to request a study creation without proper authorization', (done) => {
        request(app)
        .post('/api/studyconfig/request')
        .set('Content-Type',  'application/json')
        .send({
            study: {
                code: 'Study-XYZ',
                primaryLeader: uuidV4(),
                secondaryLeaders: [uuidV4()],
                startDate: new Date('12/12/2010'),
                endDate: new Date('12/12/2020'),
                devices: [{ 
                    name: 'Supercam 9000',
                    setings: {
                        shutterSpeed: null,
                        sensitivity: null,
                        focusMode: null,
                        focalLength: null,
                        flash: null,
                        aperture: null
                    }
                }],
                visits: [{
                    code: 'Visit 1',
                    displayOrder: 1 
                }],
                sites: [{
                    code: 'S001',
                    displayOrder: 1
                }],
                localizations: [{
                    code: 'locale-1',
                    displayOrder: 1,
                    thumbnailFile: null
                }]
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

describe('POST /api/studyconfig/updatedrequest', () => {
    it('should fail to update a request for study creation without proper authorization', (done) => {
        request(app)
        .post('/api/studyconfig/updatedrequest')
        .set('Content-Type',  'application/json')
        .send({
            study: {
                id: 1,
                code: 'Study-XYZ',
                primaryLeader: uuidV4(),
                secondaryLeaders: [uuidV4()],
                startDate: new Date('12/12/2010'),
                endDate: new Date('12/12/2020'),
                devices: [{ 
                    name: 'Supercam 9000',
                    setings: {
                        shutterSpeed: null,
                        sensitivity: null,
                        focusMode: null,
                        focalLength: null,
                        flash: null,
                        aperture: null
                    }
                }],
                visits: [{
                    code: 'Visit 1',
                    displayOrder: 1 
                }],
                sites: [{
                    code: 'S001',
                    displayOrder: 1
                }],
                localizations: [{
                    code: 'locale-1',
                    displayOrder: 1,
                    thumbnailFile: null
                }]
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

describe('POST /api/studyconfig/approve', () => {
    it('should fail to approve a study for creation without proper authorization', (done) => {
        request(app)
        .post('/api/studyconfig/approve')
        .set('Content-Type',  'application/json')
        .send({ id: 1, comments: null })
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

describe('POST /api/studyconfig/reject', () => {
    it('should fail to reject a study for creation without proper authorization', (done) => {
        request(app)
        .post('/api/studyconfig/reject')
        .set('Content-Type',  'application/json')
        .send({ id: 1, comments: null })
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

describe('POST /api/studyconfig/close', () => {
    it('should fail to close a study for creation without proper authorization', (done) => {
        request(app)
        .post('/api/studyconfig/close')
        .set('Content-Type',  'application/json')
        .send({ id: 1, comments: null })
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

describe('GET /api/studyconfig/:studyId', () => {
    it('should fail to a single study config without proper authorization', (done) => {
        request(app)
        .get('/api/studyconfig/1')
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

describe('POST /api/studyconfig/modify', () => {
    it('should fail to modify a study for creation without proper authorization', (done) => {
        request(app)
        .post('/api/studyconfig/modify')
        .set('Content-Type',  'application/json')
        .send({
            comment: null,
            study: {
                id: 1,
                comments: [],
                code: 'Study-XYZ',
                primaryLeader: uuidV4(),
                secondaryLeaders: [uuidV4()],
                startDate: new Date('12/12/2010'),
                endDate: new Date('12/12/2020'),
                devices: [{ 
                    name: 'Supercam 9000',
                    setings: {
                        shutterSpeed: null,
                        sensitivity: null,
                        focusMode: null,
                        focalLength: null,
                        flash: null,
                        aperture: null
                    }
                }],
                visits: [{
                    code: 'Visit 1',
                    displayOrder: 1 
                }],
                sites: [{
                    code: 'S001',
                    displayOrder: 1
                }],
                localizations: [{
                    code: 'locale-1',
                    displayOrder: 1,
                    thumbnailFile: null
                }],
                Subjects: []
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
