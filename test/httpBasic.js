var chai = require('chai');
var expect = chai.expect;
var httpMocks = require('node-mocks-http');

var httpBasic = require('../lib/httpBasic');

function base64(data) {
	return new Buffer(data).toString('base64');
};

describe('extractCredentials', function() {
	var extractCredentials;
	before(function() {
		extractCredentials = httpBasic.extractCredentials;
	});

	it('returns credentials from request', function() {
		var req = httpMocks.createRequest({ headers: {
			authorization: 'Basic ' + base64('user:pass')
		}});
		var creds = extractCredentials(req);
		expect(creds).to.have.property('user', 'user');
		expect(creds).to.have.property('pass', 'pass');
	});

	it('returns correct credentials even if password is empty', function() {
		var req = httpMocks.createRequest({ headers: {
			authorization: 'Basic ' + base64('user:')
		}});
		var creds = extractCredentials(req);
		expect(creds).to.have.property('user', 'user');
		expect(creds).to.have.property('pass', '');
	});

	it('returns null if auth header not set', function() {
		var req = httpMocks.createRequest();
		var creds = extractCredentials(req);
		expect(creds).to.not.exist;
	});

	it('returns null if auth method not basic', function() {
		var req = httpMocks.createRequest({ headers: {
			authorization: 'Invalid ' + base64('user:pass')
		}});
		var creds = extractCredentials(req);
		expect(creds).to.not.exist;
	});

	it('returns null if credentials in invalid format', function() {
		var req = httpMocks.createRequest({ headers: {
			authorization: 'Basic ' + base64('user')
		}});
		var creds = extractCredentials(req);
		expect(creds).to.not.exist;
	});

	it('returns null if credentials contain invalid characters', function() {
		var req = httpMocks.createRequest({ headers: {
			authorization: 'Basic ' + base64('us:er:pass')
		}});
		var creds = extractCredentials(req);
		expect(creds).to.not.exist;
	});
});

describe('askForCredentials', function() {
	var askForCredentials;
	before(function() {
		askForCredentials = httpBasic.askForCredentials('test');
	});

	it('responds with error 401 and www-auth header', function() {
		var res = httpMocks.createResponse();
		askForCredentials(res);
		expect(res).to.have.property('statusCode', 401);
		var authHeader = res.get('WWW-Authenticate');
		expect(authHeader).to.match(/realm=(?:"test"|'test')/i);
	});
});
