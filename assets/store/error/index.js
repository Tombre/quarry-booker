import mori from 'mori';
import _ from 'lodash';
import { createReducer, selectPath, createSelector } from 'store/utils';
import { find, where } from 'helper/mori';

/*----------------------------------------------------------
	Settings
----------------------------------------------------------*/

/*----------------------------------------------------------
	Actions
----------------------------------------------------------*/

// Create an error to be saved to the state. Accepts the error type, peramters, and a message. The type would usually be associated with the reducer or action.
const ERROR_CREATE = 'ERROR_CREATE';
export function createError(type, parameters = {}, msg) {
	
	if ( _.isNil(type)) {
		throw new Error('To create an error you must pass the type of the error you wish to create.');
	}

	return {
		type : ERROR_CREATE,
		payload : {
			id: _.uniqueId(),
			type,
			parameters,
			msg,
			timestamp: Date.now()
		}
	};

}

// remove an error based on it's ID
const ERROR_REMOVE = 'ERROR_REMOVE';
export function removeError(errorID) {

	if ( _.isUndefined(errorID)) {
		throw new Error('To remove an error you must pass the ID of the error you wish to remove.');
	}

	return {
		type : ERROR_REMOVE,
		payload : {
			id: errorID
		}
	};

}

/*----------------------------------------------------------
	Reducer
----------------------------------------------------------*/

function createInitialState() {
	return mori.toClj({});
}

export const reducer = createReducer([ERROR_REMOVE, ERROR_CREATE], function(state, action) {

	switch (action.type) {
		case ERROR_CREATE:
			return mori.assoc(state, action.payload.id, mori.toClj(action.payload));
			break;
		case ERROR_REMOVE:
			return mori.dissoc(state, action.payload.id);
			break;
		default:
			return state;
	}

}, createInitialState);

/*----------------------------------------------------------
	Middleware
----------------------------------------------------------*/

// This error middleware will return the payload of the error to the dispatch function. This is useful incase 
export const middleware = store => next => action => {
	if (!action.type === ERROR_CREATE) return next(action);
	// let action alter store then return the error payload
	next(action);
	return action.payload;
};

/*----------------------------------------------------------
	Selectors
----------------------------------------------------------*/

// selects the error module
export const selectError = createSelector(selectPath('ERROR'));

// select the first error that matches a query. Query can be a function or an object to search by.
export const selectErrorWhen = function(query = {}) {
	let reduceArray = [selectPath('ERROR')];
	!_.isFunction(query) ? reduceArray.push(state => find(query, state)) : reduceArray.push(state => mori.first(mori.filter(query, mori.vals(state))));
	return createSelector.apply(createSelector, reduceArray);
}

// select all errors that match a query. Query can be a function or an object to search by.
export const selectErrorsWhere = function(query = {}) {
	let reduceArray = [selectPath('ERROR')];
	!_.isFunction(query) ? reduceArray.push(state => where(query, state)) : reduceArray.push(state => mori.filter(query, mori.vals(state)));
	return createSelector.apply(createSelector, reduceArray);
}

