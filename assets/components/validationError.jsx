import React from 'react';

export default React.createClass({

	render: function() {
		return <div className="c-badge c-badge--error" style={{ marginTop: '0.5em' }}>{this.props.children}</div>
	}

});