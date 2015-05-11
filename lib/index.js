var authRbac = require('auth-rbac');
var httpBasic = require('./httpBasic');

function authRbacHttpBasic(auth, realm) {
	realm = realm || '';
	return authRbac.authenticate(auth, {
		extractCredentials: httpBasic.extractCredentials,
		askForCredentials: httpBasic.askForCredentials(realm)
	});
}

module.exports = authRbacHttpBasic;
