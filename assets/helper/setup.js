/*----------------------------------------------------------
Override native promise
----------------------------------------------------------*/

// overrides native promises so we can throw unhandled exceptions within async functions. 

(function(Promise) {

	function catchException(fn) {
		return function(err) {
			if (err instanceof Error) {
				throw err;
				return;
			}
			fn(err);
		}
	}

	var catchProto = Promise.prototype.catch;
	Promise.prototype.catch = function(fn) {
		let catchExceptionFn = catchException(fn);
		return catchProto.call(this, catchExceptionFn);
	}

})(Promise);

