import React from 'react';
import Label from 'components/label';
import moment from 'moment';
import makeRule from 'makerule';
import ValidationError from 'components/validationError';

const timeRule = makeRule.rule().isString().isNumeric().mapValue(value => (value ? parseInt(value, 10) : value)).greaterThan(0)
const hourRule = timeRule.lessThan(13);
const minuteRule = timeRule.lessThan(60);

export default React.createClass({

	propTypes: {
		name: React.PropTypes.string,
		label: React.PropTypes.string,
		value: React.PropTypes.string,
		showTimeOfDay: React.PropTypes.bool
	},

	getInitialState: function() {
		return {
			hoursValue: '' ,
			minutesValue: '',
			timeValue: 'AM'
		};
	},

	handleHoursChange: function(e) {
		let value = e.target.value;
		this.setState({ hoursValue: value });
	},

	handleMinutesChange: function(e) {
		let value = e.target.value;
		this.setState({ minutesValue: value });
	},

	handleTimeChange: function(e) {
		let value = e.target.value;
		this.setState({ timeValue: value });	
	},

	render: function() {

		let hoursValidation = hourRule(this.state.hoursValue);
		let minuteValidation = minuteRule(this.state.minutesValue);

		return <div className="c-form-element" style={{ position: 'relative' }}>
			<Label htmlFor={'form' + this.props.name}>{this.props.label}</Label>
			<div className="o-grid">
				<div className="o-grid__cell o-grid__cell--no-gutter">
					<input className={hoursValidation.result ? 'c-field' : 'c-field c-field--error'} type="text" onChange={this.handleHoursChange} value={this.state.hoursValue} placeholder="Hours" />
					{(() => {
						if (!hoursValidation.result) {
							return <ValidationError>The hour of the day must be between 1 and 12</ValidationError>;
						}	
					})()}
				</div>
				<div className="o-grid__cell o-grid__cell--width-fixed">
					<span className="c-text--loud c-heading c-heading--medium">:</span>
				</div>
				<div className="o-grid__cell o-grid__cell--no-gutter">
					<input className={minuteValidation.result ? 'c-field' : 'c-field c-field--error'} type="text" onChange={this.handleMinutesChange} value={this.state.minutesValue} placeholder="Minutes" />
					{(() => {
						if (!minuteValidation.result) {
							return <ValidationError>This is not a valid time in minutes. Minutes can be between 0 and 59</ValidationError>;
						}	
					})()}
				</div>
				{(() => {
					if (this.props.showTimeOfDay) {
						return <div className="o-grid__cell">
							<select className="c-choice c-choice--small" value={this.state.timeValue} onChange={ this.handleTimeChange }>
								<option>AM</option>
								<option>PM</option>
							</select>
						</div>
					}
				})()}
			</div>
		</div>
	}

});