const Promise = require('bluebird');
const db = require('../../../services/data');
const TokenModel = db.models.Token;
const jwt = require('jsonwebtoken');
const issueJwt = jwt.sign;
issueJwt.promise = Promise.promisify(jwt.sign);
const verifyJwt = jwt.verify;
verifyJwt.promise = Promise.promisify(jwt.verify);
const AuthenticationMiddleware = require('../../../services/authentication');

const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

const userId = 'efff2881-6979-49b0-964d-181100167efe';
const token = jwt.sign({user: userId, profiles: [1], roles: {any: 'any'}}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_EXP});

describe('#Authentication Middleware issueAccessToken', () => {
    const res = { status: () => {}, json: () => {} };
    let req; 
    let next;
    let IssueJwtPromiseStub;

    beforeEach(() => {
        req = { 
            header: {},
            user: { id: userId },
            method: 'POST',
            url: '/login',
            query: {},
            body: { userName: 'testUser1', password: 'abcdefgh' },
            get: () => {}, 
            cookies: { access_token: token }
        };
        next = sinon.spy();
        IssueJwtPromiseStub = sinon.stub(issueJwt, 'promise').returnsPromise();
        IssueJwtPromiseStub.resolves(token);
    });

    afterEach(() => {
        IssueJwtPromiseStub.restore();
    });

    it('should set req.user.access_token', () => {
        AuthenticationMiddleware.issueAccessToken(req, res, next);
        sinon.assert.calledOnce(IssueJwtPromiseStub);
        //check that req.user.access token is equal to token
        sinon.assert.match(req.user.access_token, token);
    });
});

describe('#Authentication Middleware issueRefreshToken', () => {
    const res = { status: () => {}, json: () => {} };
    let req; 
    let next;
    let IssueJwtPromiseStub;
    let TokenModelCreateStub;

    beforeEach(() => {
        req = { 
            header: () => {},
            user: { id: userId },
            method: 'POST',
            url: '/login',
            query: {},
            body: { userName: 'testUser1', password: 'abcdefgh' },
            get: () => {}, 
            cookies: { access_token: token }
        };
        next = sinon.spy();
        IssueJwtPromiseStub = sinon.stub(issueJwt, 'promise').returnsPromise();
        IssueJwtPromiseStub.resolves(token);
        TokenModelCreateStub = sinon.stub(TokenModel, 'create').returnsPromise();
    });

    afterEach(() => {
        IssueJwtPromiseStub.restore();
        TokenModelCreateStub.restore();
    });

    it('should save the user\'s refresh token to the database', () => {
        AuthenticationMiddleware.issueRefreshToken(req, res, next);
        sinon.assert.calledOnce(IssueJwtPromiseStub);
        //check that TokenModel.create was called with the correct object
        sinon.assert.calledWith(TokenModelCreateStub, { token: token, UserId: req.user.id });
    });
});

describe('#Authentication Middleware deleteTokens', () => {
    const res = { status: () => {}, json: () => {} };
    let req; 
    let next;
    let TokenModelDestroyStub;

    beforeEach(() => {
        req = { 
            header: () => {},
            user: { id: userId },
            method: 'POST',
            url: '/logout',
            query: {},
            body: {},
            get: () => {},
            cookies: { access_token: token }
        };
        next = sinon.spy();
        TokenModelDestroyStub = sinon.stub(TokenModel, 'destroy').returnsPromise();
    });

    afterEach(() => {
        TokenModelDestroyStub.restore();
    });

    it('should delete the user\'s refresh token from the database', () => {
        AuthenticationMiddleware.deleteTokens(req, res, next);
        //check that TokenModel.destroy was called with the correct object
        sinon.assert.calledWith(TokenModelDestroyStub, { where: { UserId: req.user.id } });
    });
});


describe('#Authentication Middleware logout', () => {
    const res = { status: () => {}, json: () => {}, clearCookie: sinon.spy() };
    let req; 
    let next;
    let TokenModelDestroyStub;

    beforeEach(() => {
        req = { 
            header: () => {},
            method: 'POST',
            url: '/logout',
            query: {},
            body: {},
            get: () => {},
            cookies: { access_token: token }
        };
        next = sinon.spy();
        TokenModelDestroyStub = sinon.stub(TokenModel, 'destroy').returnsPromise();
    });

    afterEach(() => {
        TokenModelDestroyStub.restore();
    });

    it('should delete the user\'s refresh token from the database and clear cookies', () => {
        AuthenticationMiddleware.logout(req, res, next);
        //check that TokenModel.destroy was called with the correct object
        sinon.assert.calledWith(TokenModelDestroyStub, { where: { UserId: userId } });
        //check that res.clearCookies was called the total number of times that there are cookies to be deleted in clearCookies function
        sinon.assert.callCount(res.clearCookie, 3);
    });
});


describe('#Authentication Middleware verifyAccessToken (validToken)', () => {
    const res = { status: () => {}, json: () => {}, clearCookie: sinon.spy() };
    let req; 
    let next;
    let VerifyJwtPromiseStub;

    beforeEach(() => {
        req = { 
            userId: userId,
            header: () => {},
            method: 'GET',
            url: '/api/users',
            query: {},
            body: {},
            get: () => {},
            cookies: { access_token: token }
        };
        next = sinon.spy();
        VerifyJwtPromiseStub = sinon.stub(verifyJwt, 'promise').returnsPromise();
        VerifyJwtPromiseStub.resolves({});
    });

    afterEach(() => {
        VerifyJwtPromiseStub.restore();
    });

    it('should call to verify the user\'s token and call next', () => {
        AuthenticationMiddleware.verifyAccessToken(req, res, next);
        //check that verifyJwt.promise was called once
        sinon.assert.calledOnce(VerifyJwtPromiseStub);
        //check that next is called to move to the next middleware function
        sinon.assert.calledOnce(next);
    });
});

describe('#Authentication Middleware verifyAccessToken (expiredToken)', () => {
    const res = { status: () => {}, json: () => {}, clearCookie: sinon.spy() };
    let req; 
    let next;
    let VerifyJwtPromiseStub;
    let JwtDecodeStub;

    beforeEach(() => {
        req = {
            header: () => {},
            method: 'GET',
            url: '/api/users',
            query: {},
            body: {},
            get: () => {},
            cookies: { access_token: token }
        };
        next = sinon.spy();
        VerifyJwtPromiseStub = sinon.stub(verifyJwt, 'promise').returnsPromise();
        VerifyJwtPromiseStub.rejects({message: 'jwt expired'});
        JwtDecodeStub = sinon.stub(jwt, 'decode').returns({user: userId, roles: {4: [1,2]}, profiles: [3]});
    });

    afterEach(() => {
        VerifyJwtPromiseStub.restore();
    });

    it('should set req.userId, req.roles and req.profiles for expired jwt token', () => {
        AuthenticationMiddleware.verifyAccessToken(req, res, next);
        //check that req.userId, req.roles, & req.profiles are set from the expired token
        sinon.assert.match(req.userId, userId);
        sinon.assert.match(req.roles, {4: [1,2]});
        sinon.assert.match(req.profiles, [3]);
    });
});