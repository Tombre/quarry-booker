import React from 'react';
import mori from 'mori';
import Kefir from 'kefir';
import _ from 'lodash';

import connect from 'store/connect';
import { createReducer, selectPath, createSelector, selectWhere, selectWhen } from 'store/utils';
import { find, where, pluck } from 'helper/mori';
import { selectData, fetch, insert, setResponse } from 'store/data';
import { selectErrorWhen, removeError, createError } from 'store/error';

import TextInput from 'components/inputs/text' ;
import Legend from 'components/legend';
import DateInput from 'components/inputs/date';
import TimeInput from 'components/inputs/time';

/*----------------------------------------------------------
App Component
----------------------------------------------------------*/

export const App = connect()(React.createClass({

	render() {
		
		const app = this.props.app;

		// <Legend>Please complete the form to request access to quarry areas:</Legend>

		let containerStyle = {
			'height': '100vh', 
			'display': 'flex',
			'alignContent': 'center',
			'alignItems': 'center'
		};

		return <div className="c-text" style={containerStyle}>
			<div className="o-container o-container--small" style={{ 'minWidth' : '400px' }}>

				<fieldset className="c-fieldset">
					 
					 <TextInput name="name" label="Your name:" placeholder="Your full name" />
					 <TextInput name="phoneNumber" label="Your phone number:" placeholder="Your phone number" />
					 <DateInput name="dateToBook" label="The date you are booking for:" placeholder="Click to select a date" />
					 <TimeInput name="timeToBook" label="The time you will be booking for" />

					 <button className="c-button c-button--primary c-button--block c-button--large">Submit Booking</button>

				</fieldset>

			</div>
		</div>;
	}

}));
