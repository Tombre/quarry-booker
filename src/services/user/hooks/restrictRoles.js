const userRoles = require('../user-roles');

exports = function(minRole) {
	function(hook) {
		if (hook.data.role && !userRoles.hasMinRole('super-admin', hook.params.user.role)) {
			throw new errors.Forbidden('You do not have permission to set this role');
		}
	}	
}