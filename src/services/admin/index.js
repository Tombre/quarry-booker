'use strict';

module.exports = function() {

	const app = this;

	app.get('/admin', function(req, res, next) {
		res.render('admin.html');
	});	

};
