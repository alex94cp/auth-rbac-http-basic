var auth = require('./common');
var should = require('should');

var rbac = {};
rbac.httpBasic = require('../');

// TODO: use mock-express

describe('authRbacHttpBasic', function() {
	var httpBasicInfo = null;
	
	before(function() {
		httpBasicInfo = rbac.httpBasic(auth, 'auth-rbac-http-basic');
	});
	
	describe('credentialsGiven', function() {
		it('should return true if req has authorization header', function() {
			var req = {};
			req.headers = {};
			req.headers.authorization = 'Authorization: Basic dXNlcjoxMjM0Cg==';
			var valid = httpBasicInfo.credentialsGiven(req);
			valid.should.be.true;
		});
		
		it('should return false otherwise', function() {
			var req = {};
			req.headers = {};
			var valid = httpBasicInfo.credentialsGiven(req);
			valid.should.be.false;
		});
	});
	
	describe('extractCredentials', function() {
		
	});
	
	describe('askForCredentials', function() {
		
	});
});
