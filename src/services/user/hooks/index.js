'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const errors = require('feathers-errors');
const mongoose = require('feathers-mongoose');
const auth = require('feathers-authentication').hooks;
const userRoles = require('../user-roles');

/*----------------------------------------------------------
Setup
----------------------------------------------------------*/

// ensures if a user is editing a role, they have to be a super user
function restrictRoleSet(hook) {
	if (hook.data.role && !userRoles.hasMinRole('super-admin', hook.params.user.role)) {
		throw new errors.Forbidden('You do not have permission to set this role');
	}
}

/*----------------------------------------------------------
Hooks
----------------------------------------------------------*/

exports.before = {
	all: [],
	find: [
		auth.verifyToken(),
		auth.populateUser(),
		auth.restrictToAuthenticated(),
		auth.restrictToRoles({
			roles: ['super-admin'],
			fieldName: 'role'
		})
	],
	get: [
		auth.verifyToken(),
		auth.populateUser(),
		auth.restrictToAuthenticated(),
		auth.restrictToRoles({
			roles: ['super-admin'],
			fieldName: 'role',
			ownerField: '_id',
			owner: true
		})
	],
	create: [
		auth.hashPassword(),
		restrictRoleSet
	],
	update: [
		auth.verifyToken(),
		auth.populateUser(),
		auth.restrictToAuthenticated(),
		auth.restrictToRoles({
			roles: ['super-admin'],
			fieldName: 'role',
			ownerField: '_id',
			owner: true
		}),
		restrictRoleSet
	],
	patch: [
		auth.verifyToken(),
		auth.populateUser(),
		auth.restrictToAuthenticated(),
		auth.restrictToRoles({
			roles: ['super-admin'],
			fieldName: 'role',
			ownerField: '_id',
			owner: true
		}),
		restrictRoleSet
	],
	remove: [
		auth.verifyToken(),
		auth.populateUser(),
		auth.restrictToAuthenticated(),
		auth.restrictToRoles({
			roles: ['super-admin'],
			fieldName: 'role',
			ownerField: '_id',
			owner: true
		})
	]
};

exports.after = {
	all: [
		mongoose.hooks.toObject({}),
		hooks.remove('password')
	],
	find: [],
	get: [],
	create: [],
	update: [],
	patch: [],
	remove: []
};
