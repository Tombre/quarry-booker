'use strict';



const roles = ['user', 'admin', 'super-admin'];

// tests if a role exists or not
exports.roleExists = role => {
	return (roles.indexOf(role) >= 0);
}

// get the permission level
exports.getPermissionLevel = role => {
	return roles.indexOf(role);
}

exports.hasMinRole = (minRole, role) => {
	return (roles.indexOf(role) >= roles.indexOf(minRole));
}

exports.roles = roles;