import React from 'react';
import Label from 'components/label'

export default React.createClass({

	propTypes: {
		name: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		label: React.PropTypes.string,
	},

	render() {
		return <div className="c-form-element">
			<Label htmlFor={'form' + this.props.name}>{this.props.label}</Label>
			<input id={'form' + this.props.name} placeholder={this.props.placeholder} className="c-field" />
		</div>
	}

});