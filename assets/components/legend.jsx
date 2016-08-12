import React from 'react';

export default React.createClass({
	render() {
		return <legend className="c-fieldset__legend">{this.props.children}</legend>
	}
});