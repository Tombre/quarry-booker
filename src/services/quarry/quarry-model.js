'use strict';

// quarry-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quarrySchema = new Schema({
	name: { type: String, required: true, unique: true },
	maxPeople: { type: Number, required: true },
	createdAt: { type: Date, 'default': Date.now },
	updatedAt: { type: Date, 'default': Date.now }
});

const quarryModel = mongoose.model('quarry', quarrySchema);

module.exports = quarryModel;