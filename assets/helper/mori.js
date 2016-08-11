import _ from 'lodash';
import Kefir from 'kefir';
import mori from 'mori';

/*----------------------------------------------------------
Mori Helpers
----------------------------------------------------------*/

export function matcher(map) {
	return record => {
		for (let key in map) {
			if (_.isObject(map[key]) || _.isArray(map[key])) {
				if (matcher(map[key])(mori.get(record, key)) === false) {
					return false;
				}
			} else if (mori.equals(mori.get(record, `${key}`), map[key]) === false) {
				return false;
			}
		}
		return record;
	};
}

// returns an array of records that match an objects perameters. Supports deeply nested structures
export function where(map, collection) {
	collection = mori.isMap(collection) ? mori.vals(collection) : collection;
	return mori.into( mori.empty(collection), mori.filter(matcher(map), collection));
}

// where but returns the first one
export function find(map, collection) {
	collection = mori.isMap(collection) ? mori.vals(collection) : collection;
	return mori.some(matcher(map), collection);
}

// A more exciting but waaay less perfomant way of doing deep where.
export function whereDeepFn(map, collection) {

	map = mori.toClj(map);

	// create a reducing function that will test each attribute
	let reduce = (map) => mori.reduceKV(
		(func, mapKey, mapValue) => {
			return mori.comp(func, (record) => {

				if (record === false ) return false;

				let recordValue = mori.get(record, mapKey);

				if (mori.isCollection(mapValue)) {
					return (reduce(mapValue)(recordValue) === true ? record : false);
				}

				if ( record && mori.equals(recordValue, mapValue) ) {
					return record;
				}

				return false;
			})
		},
		result => {
			return (result !== false ? true : false);
		},
		map
	);

	return mori.into( mori.empty(collection), mori.filter(reduce(map), collection) );
}

// takes an arrays of keys, and returns the values in a hashMap that have those keys
export function pluck(keys, hashMap) {
	let juxt = mori.juxt(...mori.take(keys.length, mori.repeat(mori.curry(mori.get, hashMap))));
	return juxt(keys);
}

// takes an attribute from each item in a collection and returns it in an array
export function pick(attr, collection) {
	return mori.intoArray(mori.map(record => mori.get(record, attr), collection));
}
// plucks then picks
export function pickAndPluck(attr, col1, col2) {
	return pluck(pick(attr, col1), col2)
}