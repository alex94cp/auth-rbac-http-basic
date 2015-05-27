exports.extractCredentials = function(req) {
	var authHeader = req.headers.authorization;
	if (!authHeader)
		return null;
	var match = authHeader.match(/^Basic +([A-Za-z0-9+]+={0,3})$/i);
	if (!match)
		return null;
	var buf = new Buffer(match[1], 'base64');
	var text = '(?:[^:\x00-\x1f\x7f]|\r\n[ \t])';
	var re = new RegExp('^(' + text + '+):(' + text + '*)$');
	var data = buf.toString().match(re);
	if (!data)
		return null;
	return { user: data[1], pass: data[2] };
};

exports.askForCredentials = function(realm) {
	var authHeader = 'Basic realm="' + realm + '"';
	return function(res) {
		return res.set('WWW-Authenticate', authHeader).sendStatus(401);
	};
};
