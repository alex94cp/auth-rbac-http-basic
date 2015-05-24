var authRbac = require('auth-rbac');
var httpBasic = require('./httpBasic');

function authRbacHttpBasic(realm) {
	return authRbac.frontend({
		extractCredentials: httpBasic.extractCredentials,
		askForCredentials: httpBasic.askForCredentials(realm)
	});
}

module.exports = authRbacHttpBasic;
