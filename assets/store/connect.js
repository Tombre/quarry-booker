import React, { Component, createElement, PropTypes } from 'react'
import mori from 'mori';
import Kefir from 'kefir';
import _ from 'lodash';

const storeShape = PropTypes.shape({
	subscribe: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	getState: PropTypes.func.isRequired
});

export default function connect(getSubscription, mapDispatchToProps, mergeProps) {

	return function wrapWithConnect(WrappedComponent) {

		return React.createClass({

			contextTypes: { store: storeShape },

			getInitialState() {
				return {
					subscriptionState: {}
				}
			},

			trySubscribe() {
				if ( !this.unsubscribe && getSubscription) {
					let handler = this.handleChange;

					let subscription = getSubscription(this.context.store, this.props);

					if (!(subscription instanceof Kefir.Observable)) {
						throw new Error('getSubscription fn passed to connect must return a subscription from the store');
					}

					// filter out null state
					// this.subscription = subscription.filter(state => (!_.isNull(state) && !_.isUndefined(state)));
					this.subscription = subscription;
					this.unsubscribe = () => {
						subscription.offValue(handler);
					};

					subscription.onValue(handler);
				}
			},

			tryUnsubscribe() {
				if (this.unsubscribe) {
					this.unsubscribe();
					this.unsubscribe = null;
				}
			},

			componentDidMount() {
				this.trySubscribe();
			},

			componentWillUnmount() {
				this.tryUnsubscribe();
				this.clearCache();
			},

			 clearCache() {
			 	this.cache = null;
			 },

			handleChange(state) {

				if (!this.unsubscribe) {
					return;
				}

				// if the state and cached states are not the same, then set the new state
				if (!this.cache || !mori.equals(state, this.cache)) {
					this.cache = state;
					let rawState = mori.toJs(state);
					this.setState({ subscriptionState: rawState });
				}

			},

			render() {

				let dispatchProps, props, store = this.context.store;

				if (_.isFunction(mapDispatchToProps) || _.isObject(mapDispatchToProps)) {
					dispatchProps = _.isFunction(mapDispatchToProps) ? mapDispatchToProps(store) : _.mapValues(mapDispatchToProps, fn => {
						return function() {
							return store.dispatch(fn(...arguments));
						};
					});
				} else {
					dispatchProps = { dispatch: store.dispatch };
				}

				if (_.isFunction(mergeProps)) {
					props = mergeProps(this.state.subscriptionState, this.props, dispatchProps);
				} else {
					props = _.assign({}, this.props, this.state.subscriptionState, dispatchProps);
				}

				return createElement(WrappedComponent, props);
			}

		});

	}

};