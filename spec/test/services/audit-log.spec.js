const AuditLogMiddleware = require('../../../services/audit-log');
const auditOptions = require('../../../services/audit-log/audit-log-options.json');
const db = require('../../../services/data');
const AuditLogModel = db.models.AuditLog;
const jwt = require('jsonwebtoken');

const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

const userId = 'efff2881-6979-49b0-964d-181100167efe';
const token = jwt.sign({user: userId, profiles: [], roles: {}}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_EXP});

describe('#Audit Log Middleware', () => {
    const res = { status: () => {}, json: () => {} };
    let req; 
    let next;
    let AuditLogCreateStub;

    beforeEach(() => {
        req = { 
            method: 'GET',
            url: '/api/users',
            query: {},
            body: {},
            userId: userId,
            get: () => {},
            cookies: { access_token: token },
            ip: '198.244.8.69'
        };
        next = sinon.spy();
        AuditLogCreateStub = sinon.stub(AuditLogModel, 'create').returnsPromise();
    });

    afterEach(() => {
        AuditLogCreateStub.restore();
    });

    it('should create the correct audit log for the request to /api/users/create', function() {
        AuditLogMiddleware(auditOptions.users.create)(req, res, next);
        sinon.assert.calledWith(AuditLogCreateStub,{ 
            detail: 'Create single user.',
            StudyId: null,
            ConfigSiteId: null,
            UserId: userId,
            ipAddress: req.ip
        });
    });
});