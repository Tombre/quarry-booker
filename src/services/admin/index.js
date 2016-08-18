'use strict';

module.exports = function() {

	const app = this;

	app.use('/admin', function(req, res, next) {
		res.render('admin.html');
	});	

};
