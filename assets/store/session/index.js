import mori from 'mori';
import _ from 'lodash';
import { callAPI } from 'store/api';
import { setResponse as setDataResponse, clear as clearData, selectData } from 'store/data';
import { createReducer, selectPath, createSelector } from 'store/utils';

/*----------------------------------------------------------
	Settings
----------------------------------------------------------*/

const authURL = '/auth/local';

/*----------------------------------------------------------
	Actions
----------------------------------------------------------*/

// Submit a thunk which dispatches an api call. If this call succeeds, the user model will be updated in the data store, and the authentication will be set
// in the session state.
export function login(email, password, remember) {
	return function(dispatch, getState) {

		let params = {
			url : authURL,
			data : { email, password, remember },
			method : 'POST'
		};

		return dispatch(callAPI(params))
			.then(response => {
				dispatch(setDataResponse('user', [response.body.user]));
				dispatch(setAuthentication(response.body.auth, response.body.user.id));
				return response;
			});
	};
}

// Submit a thunk which dispatches an api call. If this call succeeds, the authentication will be set in the session store and all objects in the data state will be
// cleared.
export function logout() {
	return function(dispatch, getState) {

		let params = {
			url : '/auth/logout/',
			method : 'GET'
		};

		return dispatch(callAPI(params))
			.then(response => {
				// clear the data then set the user
				dispatch(clearData());
				dispatch(setDataResponse('user', [response.body.user]));
				dispatch(setAuthentication(response.body.auth, response.body.user.id));
				return response;
			});
	};
}

// Get the authentication settings from the server with an `/auth/status/` call. Will insert the authenticated user into the store update the auth state with the result.
export function authenticateSession() {
	return function(dispatch, getState) {

		let params = {
			url : '/auth/status/',
			method : 'GET'
		};

		return dispatch(callAPI(params))
			.then(response => {
				dispatch(setDataResponse('user', [response.body.user]));
				dispatch(setAuthentication(response.body.auth, response.body.user.id));
				return response;
			});
	};
}

// Insert the the authentication
const SESSION_SET_AUTHENTICATION = 'SESSION_SET_AUTHENTICATION';
export function setAuthentication(authStatus, userId) {
	return {
		type : SESSION_SET_AUTHENTICATION,
		payload : {
			authStatus, userId
		}
	};
}

/*----------------------------------------------------------
	Reducer
----------------------------------------------------------*/

function createInitialState() {
	return mori.toClj({
		authStatus: 'uknown',
		userId: undefined
	});
}

export const reducer = createReducer([SESSION_SET_AUTHENTICATION], function(state, action) {

	switch (action.type) {
		case SESSION_SET_AUTHENTICATION:
			return mori.toClj(action.payload);
			break;
		default:
			return state;
	}

}, createInitialState);

/*----------------------------------------------------------
	Selectors
----------------------------------------------------------*/

// selects the page module
export const selectSession = createSelector(selectPath('SESSION'));

export const selectCurrentUserID = createSelector(state => {
	return mori.getIn(state, ['SESSION', 'userId']);
});

// selects the current user model.
export const selectCurrentUser = createSelector(state => {
	let userId = mori.getIn(state, ['SESSION', 'userId']);
	return mori.get(selectData.user(state), userId);
});