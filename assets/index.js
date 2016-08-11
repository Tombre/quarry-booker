import 'blaze/scss/blaze.scss';
import 'helper/setup';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router'

import { createStore, Provider } from 'store';

import { App as App } from './app';

import cookies from 'js-cookie';
import request from 'superagent';


/*----------------------------------------------------------
Store
----------------------------------------------------------*/

const store = createStore();

/*----------------------------------------------------------
Root Component
----------------------------------------------------------*/

const Root = React.createClass({

	propTypes: {
		store : React.PropTypes.object
	},

	loadSessionAndResources: function(nextState, replace, callback) {
		return callback();
	},

	render: function() {
		const { store } = this.props;
		return (
			<Provider store={store}>
				<Router history={browserHistory}>
					<Route path="/" onEnter={this.loadSessionAndResources} component={App}>
					</Route>
				</Router>
			</Provider>
		);
	}
});

/*----------------------------------------------------------
Render
----------------------------------------------------------*/

ReactDOM.render(
	<Root store={store} />,
	document.getElementById('app')
);