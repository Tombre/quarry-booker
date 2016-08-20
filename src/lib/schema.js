const mongoose = require('mongoose');
const _ = require('lodash');

 const Schema = function(props) {
	
	var schema = new mongoose.Schema(props);

	schema.virtual('id').get(function(){
	    return this._id.toHexString();
	});

	schema.set('toJSON', { virtuals: true });

	return schema;

}

_.assign(Schema, mongoose.Schema);

module.exports = Schema;