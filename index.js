function httpBasicCredentialsGiven(req) {
	return !!req.headers.authorization;
}

function httpBasicExtractCredentials(req) {
	var authHeader = req.headers.authorization;
	var re = /^Authorization: +Basic +([A-Za-z0-9+]+={0,3})$/i;
	var data = re.exec(authHeader);
	if (!data)
		return {};
	var buf = new Buffer(data[1], 'base64');
	var data = buf.toString('utf8');
	if (!data)
		return {};
	var index = data.indexOf(':');
	if (index == -1)
		return {};
	return { user: data.substr(0, index), pass: data.substr(index + 1) };
}

function httpBasicAskForCredentials(realm) {
	return function(res) {
		res.status(401)
		   .header('WWW-Authenticate', 'Basic realm="' + realm + '"')
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
