const request = require('supertest');
const express = require('express');
const app = require('../../../app');

describe('POST /api/images/delete', () => {
    it('should fail to delete an image without proper authorization', (done) => {
        request(app)
        .post('/api/images/delete')
        .set('Content-Type',  'application/json')
        .send({imageIds: [1]})
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

// describe('POST /api/images', () => {
//     it('should fail to upload an image without proper authorization', (done) => {
//         request(app)
//         .post('/api/images')
//         .set('Content-Type',  'application/json')
//         .send({imageIds: [1]})
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

// describe('POST /api/images/subject/:subjectId/upload/gridunit', () => {
//     it('should fail to upload an image to a specific grid unit without proper authorization', (done) => {
//         request(app)
//         .post('/api/images/subject/:subjectId/upload/gridunit')
//         .set('Content-Type',  'application/json')
//         .send({imageIds: [1]})
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

// describe('POST /api/images/subject/:subjectId/associate', () => {
//     it('should fail to upload an image to a specific grid unit without proper authorization', (done) => {
//         request(app)
//         .post('/api/images/subject/7/associate')
//         .set('Content-Type',  'application/json')
//         .send({localizationArray: [], visitArray: []})
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


describe('GET /api/images/user/me/unattached', () => {
    it('should fail to get all unattached images without proper authorization', (done) => {
        request(app)
        .get('/api/images/user/me/unattached')
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


describe('GET /api/images/subject/:subjectId/unattached', () => {
    it('should fail to get all unattached images without proper authorization', (done) => {
        request(app)
        .get('/api/images/subject/7/unattached')
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

describe('POST /api/images/:imageId/mask', () => {
    it('should fail to as a mask to an image without proper authorization', (done) => {
        request(app)
        .post('/api/images/7/mask')
        .set('Content-Type',  'application/json')
        .send({JSONMask: {}, SVGMask: {}})
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

describe('GET /api/images/:imageId', () => {
    it('should fail to get the mask for the image without proper authorization', (done) => {
        request(app)
        .get('/api/images/7')
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

describe('GET /api/images/:imageId/web', () => {
    it('should fail to get the web optimized image without proper authorization', (done) => {
        request(app)
        .get('/api/images/7/web')
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

describe('GET /api/images/:imageId/thumb', () => {
    it('should fail to get the thumb optimized image without proper authorization', (done) => {
        request(app)
        .get('/api/images/7/thumb')
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

describe('GET /api/images/:imageId/full', () => {
    it('should fail to get the full optimized image without proper authorization', (done) => {
        request(app)
        .get('/api/images/7/full')
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

describe('GET /api/images/:imageId/original', () => {
    it('should fail to get the original optimized image without proper authorization', (done) => {
        request(app)
        .get('/api/images/7/original')
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
