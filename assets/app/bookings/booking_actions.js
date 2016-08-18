import mori from 'mori';
import _ from 'lodash';

/*----------------------------------------------------------
	Actions
----------------------------------------------------------*/

export const BOOKING_SET = 'BOOKING_SET';
export function setBooking(state) {
	return {
		type: BOOKING_SET,
		payload: state
	}
}

export const BOOKING_SUBMIT = 'BOOKING_SUBMIT';
export function submitBooking() {
	return function(dispatch, getState) {

		
	}
}

