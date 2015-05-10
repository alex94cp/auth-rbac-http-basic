var should = require('should');
var httpMocks = require('node-mocks-http');

var authRbac = {};
authRbac.httpBasic = require('../');

var auth = require('./common');

function checkRequestAuthInfo(req) {
	req.should.have.property('auth');
	req.auth.should.have.properties(['user', 'role']);
	(!!req.auth.user).should.be.true;
	(!!req.auth.role).should.be.true;
}

function checkAskForCredentialsResponse(res) {
	res.statusCode.should.equal(401);
	var authHeader = res.getHeader('WWW-Authenticate');
	(authHeader !== null).should.be.true;
	var data = /realm="([^"]*)"/i.exec(authHeader);
	(!!data).should.be.true;
	data[1].should.equal('test');
}

describe('httpBasic', function() {
	var httpBasic;

	before(function() {
		httpBasic = authRbac.httpBasic(auth, 'test');
	});

	it('should put auth info in req.auth if valid credentials given', function(done) {
		var req = httpMocks.createRequest({ headers: {
			// Authorization: Basic #{base64('guest:1234')}
			authorization: 'Authorization: Basic Z3Vlc3Q6MTIzNA=='
		}});
		var res = httpMocks.createResponse();
		httpBasic(req, res, function(err) {
			if (err)
				return done(err);
			checkRequestAuthInfo(req);
			done();
		});
	});

	it('should respond with error and send realm if auth method is not basic', function(done) {
		var req = httpMocks.createRequest({ headers: {
			// Authorization: Unknown #{base64('guest:1234')}
			authorization: 'Authorization: Unknown Z3Vlc3Q6MTIzNA=='
		}});
		var res = httpMocks.createResponse();
		httpBasic(req, res, function(err) {
			if (err)
				return done(err);
			req.should.not.have.property('auth');
			checkAskForCredentialsResponse(res);
			return done();
		});
	});

	it('should respond with error and send realm if auth header is not present', function(done) {
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		httpBasic(req, res, function(err) {
			if (err)
				return done(err);
			req.should.not.have.property('auth');
			checkAskForCredentialsResponse(res);
			return done();
		});
	});
});
