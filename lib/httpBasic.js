exports.extractCredentials = function(req) {
	var authHeader = req.headers.authorization;
	if (!authHeader)
		return null;
	var data = /^Basic +([A-Za-z0-9+]+={0,3})$/i.exec(authHeader);
	if (!data)
		return null;
	var buf = new Buffer(data[1], 'base64');
	var data = buf.toString();
	data = /^([^"&'/:<>@]+):([^"&'/:<>@]*)$/.exec(data);
	if (!data)
		return null;
	return {
		user: data[1],
		pass: data[2]
	};
};

exports.askForCredentials = function(realm) {
	return function(res) {
		res.status(401)
		   .header('WWW-Authenticate', 'Basic realm="' + realm + '"')
		   .send();
	};
};
