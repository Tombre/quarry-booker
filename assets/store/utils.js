import mori from 'mori';
import { where, find } from 'helper/mori';
import _ from 'lodash';
import Kefir from 'kefir';

/*----------------------------------------------------------
	Composable Helpers
----------------------------------------------------------*/

// creates a get state function that allows you to pass a selector that will select part of the store
export function getState(store, selector) {
	let state = store.getState();
	if (selector) {
		if ( !_.isFunction(selector) ) {
			throw new Error('A selector must always be function');
		}
		return selector(state);
	}
	return state;
}

/*----------------------------------------------------------
	Reducers
----------------------------------------------------------*/

// creates a reducer function which will only deal with.
// **********
// 	actionTypes: An array of action types to respond to
// 	reducer: The reducer function
// 	initialState: The initial state as a mori collection or a function
// **********
export function createReducer(actionTypes = [], reducer, initialState) {

	if (_.isFunction(actionTypes)) {
		initialState = reducer;
		reducer = actionTypes;
		actionTypes = null;
	}

	return function(state, action) {

		// if the state doesnt exist, then evaluate the initialState argument as the state
		state = mori.isCollection(state) ? state : ( _.isFunction(initialState) ? initialState() : initialState);

		// dont run reducer on action types it doesn't own
		if (actionTypes && actionTypes.indexOf(action.type) < 0 ) {
			return state;
		}

		return reducer(state, action);
	}

}


/*----------------------------------------------------------
	Select
----------------------------------------------------------*/


// Creates memoized select functions that are able to select parts of a state object. Pass functions as arguments which will iteratively narrow down the state.
// Since the returned result of this is a function, which accepts a peice of state, you may also pass it in again to chain selectors together.
export function createSelector() {

	let cachedState, cachedSelected, fn, selectors = [...arguments];

	fn = (state) => {

		// If the state passed in is equal to the previously passed state, return the memoized result.
		if ( mori.equals(state, cachedState) ) {
			return cachedSelected;
		}

		cachedSelected = _.flow(...selectors)(state);
		cachedState = state;

		return cachedSelected;
	}

	return fn;

}

// a select function which returns a selector targeting a certain state by its path (using mori's getIn method)
export function selectPath() {
	let path = [...arguments];
	return createSelector(function(state) {
		if (path.length) {
			return mori.getIn(state, path, undefined);
		}
		return state;
	});
}

// a select function which returns a selector targeting a certain state by matching with a where fn
export function selectWhere(map) {
	return createSelector(function(state) {
		return where(map, state);
	});
}

// like selectWhere but selects the first result returned
export function selectWhen(map) {
	return createSelector(function(state) {
		return find(map, state);
	});
}

/*----------------------------------------------------------
	Middleware
----------------------------------------------------------*/

// logs the action
export const loggingMiddleware = store => next => action => {
	console.log(action);
	return next(action);
}

// if action is a function, swallow it and run it, otherwise return it to the next middleware. If the thunk returns a value, dispatch that also.
export const thunkMiddleware = store => next => action => {
	if ( !_.isFunction(action)) {
		return next(action);
	}
	let wrappedGetState = _.partial(getState, store);
	return action(store.dispatch, wrappedGetState);
}

/*----------------------------------------------------------
	Auth
----------------------------------------------------------*/

export const hasPermission = function(relationship, minPermission) {
	let relationshipTypes = ['creator', 'admin', 'editor', 'viewer'];
	let permissionLevel = relationshipTypes.indexOf(relationship);
	let minPermissionLevel = relationshipTypes.indexOf(minPermission);
	if (permissionLevel <= minPermissionLevel) { return true; }
	return false;
};