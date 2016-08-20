import _ from 'lodash';
import mori from 'mori';
// import joi from 'joi';

import { createReducer, createSelector, selectPath } from 'store/utils';
import { schema } from './schema';
import { callAPI } from 'store/api';
import { where, find } from 'helper/mori';


/*----------------------------------------------------------
	Settings
----------------------------------------------------------*/

const data_config = {
	index : 'id', // the attribute to use as an index. If not set, will use the unique data id
};

/*----------------------------------------------------------
	helper
----------------------------------------------------------*/

function moriToJs(record) {
	if (mori.isCollection(record)) {
		return mori.toJs(record);
	}
	return record;
}

function dispatchWithParams(dispatch, action, params) {
	return dispatch(callAPI(params))
			.then(response => {
				
				let body = response.body;

				dispatch(clearQueue(action));

				if (params.method === 'GET'){
					let models = body.id ? [body] : body.data;
					dispatch(setResponse(action.payload.collectionName, models));
				} else if (params.method === 'DELETE') {
					dispatch(clearRecord(action.payload.collectionName, body.id))
				} else {
					dispatch(setResponse(action.payload.collectionName, body))
				}

				// sometimes the body of the request is a container. If it is, we have to format it so this promise returns the actual data.
				if (body.id || _.isArray(body)) return body;
				if (body.data) return body.data;

			}, error => {
				dispatch(clearQueue(action));
				return Promise.reject(error); 
			});
}

/*----------------------------------------------------------
	Actions
----------------------------------------------------------*/

// Inserts a new record. Accepts an object describing the record.
const INSERT = 'DATA_INSERT';
export function insert(collectionName, record) {
	return function(dispatch, getState) {

		record = moriToJs(record);

		let params = {
			url: '/api' + schema[collectionName].endpoint,
			method: 'POST',
			data: record
		};

		let action = {
			type : INSERT,
			payload : { collectionName, record }
		};

		dispatch(action);
		return dispatchWithParams(dispatch, action, params);

	}
}

// Creates an action which updates a single record. Accepts the id of the record and an object to update it with.
const UPDATE = 'DATA_UPDATE';
export function update(collectionName, id, record, sync = true) {
	return function(dispatch, getState) {

		record = moriToJs(record);

		let params = {
			url: '/api' + schema[collectionName].endpoint + id,
			method: 'PUT',
			data: record
		};

		let action = {
			type : UPDATE,
			payload : { collectionName, record: _.assign({ id }, record) }
		};

		dispatch(action);
		return dispatchWithParams(dispatch, action, params);

	}
}

// Creates an action which destroys a single record.
const DESTROY = 'DATA_DELETE';
export function destory(collectionName, id, sync = true) {
	return function(dispatch, getState) {

		let params = {
			url: '/api' + schema[collectionName].endpoint + id,
			method: 'DELETE'
		};

		let action = {
			type : DESTROY,
			payload : { collectionName, id }
		};

		dispatch(action);
		return dispatchWithParams(dispatch, action, params);

	}
}

// Creates an action which runs a query for a particular record.
const FETCH = 'DATA_FETCH';
export function fetch(collectionName, query, options = {}) {
	return function(dispatch, getState) {

		let params = {
			url : '/api' + schema[collectionName].endpoint,
			query,
			method : 'GET'
		};

		let action = {
			type : FETCH,
			payload : { collectionName, query }
		};

		dispatch(action);
			
		// if there is an ID just use that as the endpoint with no query
		if (params.query.id) {
			params.url += params.query.id + '/';
			if (!options.forceQuery) {
				delete params.query;
			}
		}

		return dispatchWithParams(dispatch, action, params);

	}
}

// Sets an array of records that have been passed along from the server.
const SET_RESPONSE = 'DATA_SET_RESPONSE';
export function setResponse(collectionName, records) {
	return {
		type : SET_RESPONSE,
		payload : {
			collectionName,
			records,
		}
	};
}


// Inserts a new record. Accepts an object describing the record.
const CLEAR_RECORD = 'DATA_CLEAR_RECORD';
export function clearRecord(collectionName, id) {
	return {
		type : CLEAR_RECORD,
		payload : { collectionName, id }
	};
}

// Inserts a new record. Accepts an object describing the record.
const CLEAR_QUEUE = 'DATA_CLEAR_QUEUE';
export function clearQueue(action) {
	return {
		type : CLEAR_QUEUE,
		payload : {
			dataAction: action
		}
	};
}



/*----------------------------------------------------------
	Reducer
----------------------------------------------------------*/

export const reducer = createReducer([INSERT, UPDATE, DESTROY, FETCH, SET_RESPONSE, CLEAR_RECORD, CLEAR_QUEUE], function(state, action) {

	let collectionName = action.payload.collectionName;
	let collection = mori.get(state, collectionName);

	if ( [CLEAR_RECORD, CLEAR_QUEUE].indexOf(action.type) === -1 && !mori.isCollection(collection) ) {
		throw new Error(`The collection "${collectionName}" doesn't exist in the data store. You probably tried to add to it accidently or haven't set it up in the schema`);
	}

	switch (action.type) {
		case INSERT:
		case UPDATE:
		case DESTROY:
		case FETCH:
			state = mori.assoc(state, '_syncQueue', 
				mori.conj(mori.get(state, '_syncQueue'), mori.toClj(action))
			);	
			break;
		case CLEAR_QUEUE:
			let _syncQueue = mori.get(state, '_syncQueue');
			let payload = mori.toClj(action.payload.dataAction);
			state = mori.assoc(state, '_syncQueue', 
				mori.remove(val => mori.equals(val, payload), _syncQueue)
			);
			break;
		case SET_RESPONSE:
			let records = action.payload.record || action.payload.records;
			records = _.isArray(records) ? records : [records];
			state = mori.assoc(state, collectionName, setData(collection, records));
			break;
		case CLEAR_RECORD:
			state = mori.assoc(state, mori.dissoc(collection, action.payload.id));
		break;
		default:
			return state;
	}

	return state;

}, createStructure);

/*----------------------------------------------------------
	Lib
----------------------------------------------------------*/

// create a state structure of the collection
function createStructure() {
	let map = [];
	for (let collection in schema) {
		map.push(collection, mori.hashMap());
	}
	map.push('_syncQueue', mori.vector());
	return mori.hashMap(...map);
}

// sets an array of records (objects) to a collection. This method will use an index if one exists, else it will create a unique data point
function setData(collection, records = []) {

	let recordMap = mori.hashMap();

	for (var i = records.length - 1; i >= 0; i--) {

		let record = records[i];
		let id = _.get(record, data_config.index);

		if (!id) {
			id = _.uniqueId('data_');
			record = _.assign({ temp_id: id }, record);
		}

		recordMap = mori.assoc(recordMap, id, mori.toClj(record));

	};

	return mori.merge(collection, recordMap);

}


/*----------------------------------------------------------
	Selectors
----------------------------------------------------------*/

// Select data
const selectData = createSelector(selectPath('DATA'));

// do some trickery to add each model to the select function as a method. So this is a function you can pass to createSelectors: `selectData.rows`
Object.keys(schema).forEach((model) => {
	selectData[model] = createSelector(selectData, selectPath(model));
});

export { selectData };
