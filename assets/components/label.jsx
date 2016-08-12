import React from 'react';

export default React.createClass({

	propTypes: {
		'htmlFor': React.PropTypes.string
	},

	render() {
		return <label className="c-label" htmlFor={this.props.for}>{this.props.children}</label>
	}

});