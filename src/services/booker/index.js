'use strict';

module.exports = function() {
	
	const app = this;

	app.get('/', function(req, res, next) {
		res.render('booker.html');
	});

};
