import { createStore as makeStore, applyMiddleware, compose } from 'redux';
import mori from 'mori';
import Kefir from 'kefir';
import _ from 'lodash';
import { createSelector, createReducer, loggingMiddleware, thunkMiddleware, getState } from './utils';
import { Provider } from 'react-redux';
import Connect from './connect';

// modules

import { reducer as API, middleware as API_Middleware } from 'store/api';
import { reducer as DATA, fetchDataMiddleware, saveChangesMiddleware } from 'store/data';
import { reducer as ERROR, middleware as errrorMiddleware } from 'store/error';
import { reducer as SESSION } from 'store/session';

/*----------------------------------------------------------
	Store
----------------------------------------------------------*/

function createStore(reducers = {}, middleware = []) {

	// add default middleware and reducers
	reducers = _.assign({ API, DATA, SESSION, ERROR }, reducers); // assign also works to create a new object
	middleware = middleware.concat([thunkMiddleware, loggingMiddleware, fetchDataMiddleware, saveChangesMiddleware, API_Middleware, errrorMiddleware]);

	// store is the redux instance with middleware and reducers applied
	const store = makeStore(
		combineReducers(reducers),
		compose(
			applyMiddleware(...middleware),
			(window.devToolsExtension ? window.devToolsExtension() : f => f)
		)
	);

	// event stream is the primary observable for the store. All subscriptions are returned from it.
	const eventStream = createEventStream(store);

	return {
		subscribe : _.partial(subscribe, eventStream),
		getState : _.partial(getState, store),
		getStateJs : function() {
			return mori.toJs(getState(store, ...arguments));
		},
		dispatch : store.dispatch,
		setReducer : _.partial(setReducer, reducers),
		removeReducer : _.partial(setReducer, store, reducers),
		getReducerMap : () => reducers
	};

};

/*----------------------------------------------------------
	Store Actions
----------------------------------------------------------*/

const CLEAR_STATE = 'STORE_CLEAR_STATE';
// pass arguments for key
function clearState() {
	let path = [...arguments];
	return {
		type : CLEAR_STATE,
		payload : {
			path : path
		}
	};
}

/*----------------------------------------------------------
	Reducers
----------------------------------------------------------*/

function setReducer(reducersMap, key, reducer) {
	reducersMap[key] = reducer;
}

function removeReducer(store, reducersMap, key, reducer) {
	delete reducersMap[key];
	store.dispatch(clearState(key));
}

// we setup our own reducer combination function so that
function combineReducers(reducersMap) {
	return (state, action) => {

		state = state || mori.hashMap();

		// if the action is for the store only...
		switch (action.type) {
			case CLEAR_STATE:
				state = clearSate(state, action.payload.path);
				break;
		}

		for (let reducerName in reducersMap) {

			let reducer = reducersMap[reducerName];
			let selection = mori.get(state, reducerName, undefined);

			let reducerState = reducer(selection, action);

			if ( _.isUndefined(reducerState) || !mori.isCollection(reducerState) ) {
				throw new Error('Reducers must return an immutable mori object');
			}

			// add the result of the reducer to the state, passing on the reducers slice of data
			state = mori.assoc(state, reducerName, reducerState);

		}
		return state;
	};
}

/*----------------------------------------------------------
	Event Stream
----------------------------------------------------------*/

// Returns an event stream for the store. The event stream will only emit updates to the state that are not equal to the previous state.
function createEventStream(store) {
	return Kefir.stream(emitter => {

		let prevValue = store.getState();

		let dispose = store.subscribe(() => {

			let toEmit, currentValue = store.getState();

			// compare values - if they are not the same, emit it
			if (!mori.equals(currentValue, prevValue)) {
				emitter.emit(currentValue);
			}

		});

		// when this stream has no more subscribers, the listener will unsubscribe itself
		return () => {
			dispose();
		};

	}).toProperty(() => store.getState());
}

/*----------------------------------------------------------
	Manage State
----------------------------------------------------------*/

// Subscribe to an event stream. The selector can be a regular function or a memoized selector created with the
// createSelector method. Subscribing to this service will return an observable. This observable will only emit values if the output changes.
function subscribe(eventStream, selector) {

		let prev;

		// return an optimised subscription that only emits a selected value if it has changed.
		return eventStream
			.withHandler((emitter, event) => {

				let state, { type, value } = event;

				// if the event is the end of the stream, an error, or the value is not a collection, pass it though
				if (!mori.isCollection(value) || type === 'end' || type === 'error') {
					return emitter.emitEvent({ type, value });
				}

				if (selector) {
					if ( !_.isFunction(selector) ) {
						throw new Error('A selector must always be function');
					}
					state = selector(value);
				} else {
					state = value;
				}

				// if the value is not the same as the previous one then emit it
				if ( _.isUndefined(prev) || !mori.equals(state, prev)) {
					prev = state;
					emitter.emitEvent({ type, value : state });
				}
			});
}

// clears a portion of state
function clearSate(state, path = []) {
	if (!path.length) {
		return mori.hashMap();
	}
	return mori.updateIn(state, path, mori.empty);
}

// gets some state's type
function getStateType(state) {
	let tests = {
		'vector' : mori.isVector,
		'hashMap' : mori.isMap,
		'set' : mori.isSet,
		'list' : mori.isList,
		'none' : () => true
	}
	for (let type in tests) {
		if (tests[type](state) === true){
			return type;
		}
	}
}

/*----------------------------------------------------------
	Exports
----------------------------------------------------------*/

export { createStore, createSelector, createReducer, Provider, Connect };