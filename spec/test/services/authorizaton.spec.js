const AuthorizationMiddleware = require('../../../services/authorization');
const authOptions = require('../../../services/authorization/authorization-options.json');
const db = require('../../../services/data');
const RightsProfileModel = db.models.RightsProfile;
const jwt = require('jsonwebtoken');

const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

const userId = 'efff2881-6979-49b0-964d-181100167efe';
const token = jwt.sign({user: userId, profiles: [1], roles: {any: 'any'}}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_EXP});

describe('#Authorization Middleware access granted', () => {
    const res = { status: () => {}, json: () => {} };
    let req; 
    let next;
    let RightsProfileFindOneStub;

    beforeEach(() => {
        req = { 
            method: 'POST',
            url: '/api/visits/1',
            query: {StudyId: '9998', ConfigSiteId: '1000'},
            roles: {any: 'any'},
            profiles: [1],
            body: {},
            get: () => {},
            cookies: { access_token: token }
        };
        next = sinon.spy();
        RightsProfileFindOneStub = sinon.stub(RightsProfileModel, 'findOne').returnsPromise();
        RightsProfileFindOneStub.resolves({
            id: 1,
            systemAdmin: true,
            permissions: {
                visits: {
                    reviewVisit: true
                }
            }
        });
    });

    afterEach(() => {
        RightsProfileFindOneStub.restore();
    });

    it('should allow a system admin user acces to /api/visits/1', function() {
        AuthorizationMiddleware('visits', authOptions.visits.reviewVisit, true)(req, res, next);
        sinon.assert.calledOnce(next);
    });
});

describe('#Authorization Middleware access denied', () => {
    const res = { status: () => {}, json: () => {} };
    let req; 
    let next;
    let RightsProfileFindOneStub;

    beforeEach(() => {
        req = { 
            header: {},
            method: 'POST',
            url: '/api/visits/1',
            query: {StudyId: '9998', ConfigSiteId: '1000'},
            body: {},
            roles: {},
            profiles: [],
            get: () => {},
            cookies: { access_token: token }
        };
        next = sinon.spy();
        RightsProfileFindOneStub = sinon.stub(RightsProfileModel, 'findOne').returnsPromise();
        RightsProfileFindOneStub.resolves({
            id: 1,
            systemAdmin: false,
            permissions: {
                visits: {
                    reviewVisit: false
                }
            }
        });
    });

    afterEach(() => {
        RightsProfileFindOneStub.restore();
    });

    it('should deny an unauthorized user acces to /api/visits/1', function() {
        AuthorizationMiddleware('visits', authOptions.visits.reviewVisit, true)(req, res, next);
        sinon.assert.notCalled(next);
    });
});