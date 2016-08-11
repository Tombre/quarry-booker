import React from 'react';
import mori from 'mori';
import Kefir from 'kefir';
import _ from 'lodash';

import connect from 'store/connect';
import { createReducer, selectPath, createSelector, selectWhere, selectWhen } from 'store/utils';
import { find, where, pluck } from 'helper/mori';
import { selectData, fetch, insert, setResponse } from 'store/data';
import { selectErrorWhen, removeError, createError } from 'store/error';

/*----------------------------------------------------------
App Component
----------------------------------------------------------*/

export const App = connect()(React.createClass({

	render() {
		
		const app = this.props.app;

		return <div>
			<p>Test</p>
		</div>;
	}

}));
