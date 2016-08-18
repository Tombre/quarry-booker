import mori from 'mori';
import _ from 'lodash';
import { createReducer } from 'store/utils';

import { BOOKING_SET } from 'app/bookings/booking_actions';

/*----------------------------------------------------------
	Reducer
----------------------------------------------------------*/

function createInitialState() {
	return mori.toClj({
		location: null,
		name: null,
		phone_number: null,
		email: null,
		date: null,
		time: null,
		duration: null,	
		error: null,
		success: null
	});
}

export default createReducer(function(state, action) {
	switch (action.type) {
		case BOOKING_SET:
			return mori.into(state, mori.toClj(action.payload));
			break;
		default:
			return state;
	}

}, createInitialState);