var chai = require('chai');
var expect = chai.expect;
var httpMocks = require('node-mocks-http');

var authRbac = require('auth-rbac');
authRbac.httpBasic = require('../');
var auth = require('./common');

function checkRequestAuthInfo(req) {
	expect(req).to.have.deep.property('auth.user').that.exists;
	expect(req).to.have.deep.property('auth.role').that.exists;
}

function checkAskForCredentialsResponse(res) {
	expect(res).to.have.property('statusCode', 401);
	var authHeader = res.getHeader('WWW-Authenticate');
	expect(authHeader).to.be.ok;
	var data = /realm="([^"]*)"/i.exec(authHeader);
	expect(data).to.be.ok.and.have.deep.property('[1]', 'test');
}

describe('httpBasic', function() {
	var httpBasic;

	before(function() {
		httpBasic = authRbac.httpBasic(auth, 'test');
	});

	it('puts auth info in req.auth if valid credentials given', function(done) {
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

	it('responds with error and sends realm if auth method is not basic', function(done) {
		var req = httpMocks.createRequest({ headers: {
			// Authorization: Unknown #{base64('guest:1234')}
			authorization: 'Authorization: Unknown Z3Vlc3Q6MTIzNA=='
		}});
		var res = httpMocks.createResponse();
		httpBasic(req, res, function(err) {
			if (err)
				return done(err);
			expect(req).to.not.have.property('auth');
			checkAskForCredentialsResponse(res);
			return done();
		});
	});

	it('responds with error and sends realm if auth header is not present', function(done) {
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		httpBasic(req, res, function(err) {
			if (err)
				return done(err);
			expect(req).to.not.have.property('auth');
			checkAskForCredentialsResponse(res);
			return done();
		});
	});
});
