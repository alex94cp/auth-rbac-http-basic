var rbac = require('auth-rbac');

function extractCredentials(req) {
	var authHeader = req.headers.authorization;
	if (!authHeader)
		return null;
	var re = /^Authorization: +Basic +([A-Za-z0-9+]+={0,3})$/i;
	var data = re.exec(authHeader);
	if (!data)
		return null;
	var buf = new Buffer(data[1], 'base64');
	var data = buf.toString('utf8');
	if (!data)
		return null;
	var index = data.indexOf(':');
	if (index == -1)
		return null;
	return {
		user: data.substr(0, index),
		pass: data.substr(index + 1)
	};
}

function askForCredentials(realm) {
	return function(res) {
		res.status(401)
		   .header('WWW-Authenticate', 'Basic realm="' + realm + '"')
		   .send();
	};
}

function httpBasic(auth, realm) {
	realm = realm || '';
	return rbac.authenticate(auth, {
		extractCredentials: extractCredentials,
		askForCredentials: askForCredentials(realm)
	});
}

module.exports = httpBasic;
