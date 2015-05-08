var auth = require('./common');
var should = require('should');
var httpMocks = require('node-mocks-http');

var rbac = {};
rbac.httpBasic = require('../');

describe('authRbacHttpBasic', function() {
	var httpBasicInfo = null;
	
	before(function() {
		httpBasicInfo = rbac.httpBasic(auth, 'auth-rbac-http-basic');
	});
	
	describe('credentialsGiven', function() {
		it('should return true if req has authorization header', function() {
			var req = httpMocks.createRequest({ headers: {
				authorization: 'Authorization: Basic dXNlcjoxMjM0'
			}});
			var valid = httpBasicInfo.credentialsGiven(req);
			valid.should.be.true;
		});
		
		it('should return false otherwise', function() {
			var req = httpMocks.createRequest();
			var valid = httpBasicInfo.credentialsGiven(req);
			valid.should.be.false;
		});
	});
	
	describe('extractCredentials', function() {
		it('should extract credentials from auth header', function() {
			var req = httpMocks.createRequest({ headers: {
				authorization: 'Authorization: Basic dXNlcjoxMjM0'
			}});
			var creds = httpBasicInfo.extractCredentials(req);
			creds.should.have.properties({
				user: 'user', pass: '1234'
			});
		});
		
		it('should return empty object if schema is not Basic', function() {
			var req = httpMocks.createRequest({ headers: {
				authorization: 'Authorization: Unknown ABCDEF0123456789'
			}});
			var creds = httpBasicInfo.extractCredentials(req);
			creds.should.be.empty;
		});
		
		it('should return empty object if invalid base64', function() {
			var req = httpMocks.createRequest({ headers: {
				authorization: 'Authorization: Basic !"·$%&/()=?¿'
			}});
			var creds = httpBasicInfo.extractCredentials(req);
			creds.should.be.empty;
		});
	});
	
	describe('askForCredentials', function() {
		it('should return appropiate response header', function() {
			var res = httpMocks.createResponse();
			httpBasicInfo.askForCredentials(res);
			res.statusCode.should.equal(401);
			var authHeader = res.getHeader('WWW-Authenticate');
			var data = /realm="([^"]*)"/i.exec(authHeader);
			(data !== null).should.be.true;
			data[1].should.equal('auth-rbac-http-basic');
		});
	});
});
