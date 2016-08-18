'use strict';

exports.testRole = function(minRole) {
	return function(hook) {
		console.log('My custom global hook ran. Feathers is awesome!');
	};
};
