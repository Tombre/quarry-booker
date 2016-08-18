import React from 'react';
import mori from 'mori';
import Kefir from 'kefir';
import _ from 'lodash';

import connect from 'store/connect';
import { createReducer, selectPath, createSelector, selectWhere, selectWhen } from 'store/utils';
import { find, where, pluck } from 'helper/mori';

import { selectBooking } from 'app/bookings/booking_selectors';

import TextInput from 'components/inputs/text' ;
import Legend from 'components/legend';
import DateInput from 'components/inputs/date';
import TimeInput from 'components/inputs/time';
import TimeSelect from 'components/inputs/timeSelect';
import SelectInput from 'components/inputs/select';

/*----------------------------------------------------------
App Component
----------------------------------------------------------*/

function getSubscription(store, props) {
	return store.subscribe(selectBooking);
}

export const App = connect(getSubscription)(React.createClass({

	render() {
		
		const app = this.props.app;

		return <div className="bookings c-text">
			<div className="bookings-container o-container o-container--small u-letter-box--super">

				<fieldset className="c-fieldset">

					<Legend>Please complete the form to request access to quarry areas:</Legend>

					
					<div className="bookings__panel">
						<SelectInput options={{ 'boya': "Boya Mountain Quarry", 'Stathams': "Statham's Quarry" }} />
						<DateInput name="dateToBook" label="The date you are booking for:" placeholder="Click to select a date" />
						<TimeSelect label="The time period you will be booking for" />
						<TimeInput name="timeToBook" label="The time you will be booking for" showTimeOfDay={true} />
					 </div>
					 <div className="bookings__panel">
						 <TextInput name="name" label="Your name:" placeholder="Your full name" />
						 <TextInput name="phoneNumber" label="Your phone number:" placeholder="Your phone number" />
						 <TextInput name="email" label="Your email:" placeholder="Your email address" />
					</div>
					 
					 

					 <TimeInput name="timeToBook" label="The duration of time you'll be at the quarry" />

					 <button className="c-button c-button--primary c-button--block c-button--large">Submit Booking</button>

				</fieldset>

			</div>
		</div>;
	}

}));
