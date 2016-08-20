'use strict';

// bookings-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = require('../../lib/schema');

const bookingsSchema = new Schema({
	createdAt: { type: Date, 'default': Date.now },
	updatedAt: { type: Date, 'default': Date.now },
	quarry: { type: Schema.Types.ObjectId, required: true },
	numberOfPeople: { type: Number, required: true },
	date: { type: Date, 'default': Date.now, required: true },
	startTime: { type: Date, 'default': Date.now, required: true },
	endTime: { type: Date, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	phoneNumber: { type: String, required: true }
});

const bookingsModel = mongoose.model('bookings', bookingsSchema);

module.exports = bookingsModel;