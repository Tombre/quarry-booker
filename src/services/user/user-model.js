'use strict';

// user-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('./user-roles');
const Schema = require('../../lib/schema');

const userSchema = new Schema({
	email: {
		type: String, 
		unique: true, 
		required: true,
		 validate: {
		 	validator: validator.isEmail,
		 	message: '{VALUE} is not a valid email'
		 }
	},
	password: { type: String, required: true },
	role: {
		type: String,
		default: userRoles.roles[0],
		validate: userRoles.roleExists
	},
	createdAt: { type: Date, 'default': Date.now },
	updatedAt: { type: Date, 'default': Date.now }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;