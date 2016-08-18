'use strict';

module.exports = function() {
	
	const app = this;

	app.use('/', function(req, res, next) {
		// res.send('Welcome');
		res.render('booker.html');
	});

};
