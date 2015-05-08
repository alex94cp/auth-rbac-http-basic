function httpBasicCredentialsGiven(req) {
	return !!req.headers.authorization;
}

function httpBasicExtractCredentials(req) {
	var authHeader = req.headers.authorization;
	var data = authHeader.match(/^Authorization: +Basic +([A-Za-z0-9+]+={0,3})$/i);
	if (!data)
		return {};
	var buf = new Buffer(data[0], 'base64');
	var data = buf.toString('utf8');
	if (!data)
		return {};
	data = data.split(':');
	return { user: data[0], pass: data.shift() };
}

function httpBasicAskForCredentials(realm) {
	return function(res) {
		res.status(401)
		   .setHeaders('WWW-Authenticate', 'Basic: realm="' + realm + '"')
		   .send();
	};
}

function httpBasicAuth(auth, realm) {
	realm = realm || '';
	return {
		credentialsGiven: httpBasicCredentialsGiven,
		extractCredentials: httpBasicExtractCredentials,
		askForCredentials: httpBasicAskForCredentials(realm)
	};
}

module.exports = httpBasicAuth;
