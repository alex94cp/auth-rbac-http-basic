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
		user: decodeURIComponent(data[1]),
		pass: decodeURIComponent(data[2])
	};
};

exports.askForCredentials = function(realm) {
	var authHeader = 'Basic realm="' + realm + '"';
	return function(res) {
		return res.set('WWW-Authenticate', authHeader).sendStatus(401);
	};
};
