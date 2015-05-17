var httpBasic = require('./httpBasic');

function authRbacHttpBasic(realm) {
	return {
		extractCredentials: httpBasic.extractCredentials,
		askForCredentials: httpBasic.askForCredentials(realm)
	};
}

module.exports = authRbacHttpBasic;
