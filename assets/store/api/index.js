import request from 'superagent';
import cookies from 'js-cookie';
import mori from 'mori';
import _ from 'lodash';

import { where } from 'helper/mori';
import { createReducer, selectPath, createSelector } from 'store/utils';
import { createError } from 'store/error';
import * as errorTypes from 'store/error/error_types';

/*----------------------------------------------------------
	Settings
----------------------------------------------------------*/

let { hostname, protocol, port } = window.location;
const host = protocol + '//' + hostname + (port.length ? ':' + port : '');

/*----------------------------------------------------------
	Actions
----------------------------------------------------------*/

// Produce an action which will make an API request. This action will be picked up by middleware which will return a promise to
// to the dispatch method.
const API_CALL = 'API_CALL'; 
export function callAPI(params) {

	// apply defaults to the params
	params = _.assign({
		url : '', // the url of the request
		data : {}, // some data to pass
		query : {}, // a query string/object
		headers: {} // the headers to include in the request
	}, params);

	return {
		type : API_CALL,
		payload : params
	}

}

// Alter the state to show that an API request is being made
const API_REQUEST = 'API_REQUEST';
function runningAPIRequest(params) {
	return {
		type : API_REQUEST,
		payload : params
	}
}

// Complete an api request with the params of the origional request
const API_REQUEST_COMPLETE = 'API_REQUEST_COMPLETE';
function completeAPIRequest(response, params) {
	return {
		type : API_REQUEST_COMPLETE,
		payload : {
			response : response,
			params : params
		}
	}
}

// Dispatched when the api rtesposne is rejected. This also dispatches an error action.
function throwAPIRequestError(error, response, params) {
	
	let type = errorTypes[`ERROR_API_${error.status}`];
	type = type || errorTypes.ERROR_API_UNKOWN;

	let errorParams = {
		response: error.response || {},
		status: error.status,
		request: params
	};

	let msg = `API error: cannot ${params.method} ${params.url}${params.query ? ':' + JSON.stringify(params.query) : null} (${errorParams.response.statusCode}) ${errorParams.response.statusText}`;
	
	return createError(type, errorParams, msg);
}

/*----------------------------------------------------------
	Reducer
----------------------------------------------------------*/

function createInitialState() {
	return mori.hashMap(
		'currentRequests', mori.vector() // a list  of the current requests
	);
}

export const reducer = createReducer([API_REQUEST, API_REQUEST_COMPLETE], function(state, action, record) {

	switch (action.type) {
		case API_REQUEST:
			// adds the current requests to the to the requests vector
			let requests = mori.conj(mori.get(state, 'currentRequests'), mori.toClj(action.payload));
			return mori.assoc(state, 'currentRequests', requests);
			break;
		case API_REQUEST_COMPLETE:
			// find the correct request in the current requests vector and remove it
			let f = mori.partial(mori.equals, mori.toClj(action.payload.params));
			return mori.assoc(state, 'currentRequests', mori.remove(f, mori.get(state, 'currentRequests')));
			break;
		default:
			return state;
	}
}, createInitialState);


/*----------------------------------------------------------
	Middleware
----------------------------------------------------------*/

// If the action is an api call, then it is processed via this middleware. This returns a kefir stream to the dispatch method which will complete with the API call.
// Success and error results are passed onto the next middleware chain. This will swallow the initial call request.
export const middleware = store => next => action => {

	if (action.type !== API_CALL) {
		return next(action);
	}

	let params, url, deferred, makeRequestCall;

	params = action.payload;
	url = params.url;

	// if (params.method !== 'GET') {
	// 	params.headers["X-CSRFToken"] = cookies.get('csrftoken');
	// }

	// dispatch action to tell the state that the api request is running
	store.dispatch(runningAPIRequest(params));

	// make the API call
	makeRequestCall = function(resolve, reject) {

		let req = request(params.method, url).set(params.headers).type('json');

		if (params.method === 'GET') {
			req = req.query(params.query)
		} else {
			req = req.set('Content-Type', (params.contentType || 'application/json; charset=utf-8')).send(params.data);
		}

		return req.end(function(error, response){
				store.dispatch(completeAPIRequest(response, params));
				if (!_.isNull(error)) {
					// return the error generated from the dispatch call
					error = store.dispatch(throwAPIRequestError(error, response, params));
					return reject(error);
				}
				return resolve(response);
			 });
	};

	return new Promise(makeRequestCall);

};

/*----------------------------------------------------------
	Selectors
----------------------------------------------------------*/

export const selectAPI = createSelector(selectPath('API'));

// creates a selector which selects the loading request
export const selectLoadingByParams = function(params) {
	return createSelector(
		selectPath('API', 'currentRequests'),
		createSelector(currentRequests => where(params, currentRequests))
	);
}