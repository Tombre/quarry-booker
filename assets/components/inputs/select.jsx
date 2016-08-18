import React from 'react';
import Label from 'components/label'

export default React.createClass({

	propTypes: {
		name: React.PropTypes.string,
		options: React.PropTypes.object,
		label: React.PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			options: {}
		};
	},

	render: function() {

		console.log();

		return <div className="c-form-element">
			<Label htmlFor={'form' + this.props.name}>{this.props.label}</Label>
			<select id={'form' + this.props.name} className="c-choice">
				{Object.keys(this.props.options).map((key, i) => <option key={i} value={key}>{this.props.options[key]}</option>)}
			</select>
		</div>
	}

});