import _ from 'lodash';
import Kefir from 'kefir';
import mori from 'mori';

/*----------------------------------------------------------
	Streams
----------------------------------------------------------*/

export const streamFromPromise = function(promise) {
	return Kefir.stream(emitter => {
		promise.then(res => emitter.emit(res)).then(() => emitter.end());
	});
}