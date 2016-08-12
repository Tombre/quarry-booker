import React from 'react';
import Calendar from 'components/inputs/calendar';
import Label from 'components/label';
import moment from 'moment';

export default React.createClass({

	getInitialState() {
		return {
			value: null,
			calendarOpen: false
		};
	},

	propTypes: {
		name: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		label: React.PropTypes.string,
		value: React.PropTypes.string,
	},

	selectDate: function(date) {
		this.setState({ value: date });
		this.closeCalendar();
	},

	closeCalendar: function() {
		this.setState({ calendarOpen: false });
		document.removeEventListener('click', this.closeCalendar, false);	
	},

	openCalendar: function() {
		document.addEventListener('click', this.closeCalendar, false);	
		this.setState({ calendarOpen: true });
	},

	handleClick: function() {
		this.openCalendar();
	},

	render: function() {
		return <div className="c-form-element" style={{ position: 'relative' }}>
			<Label htmlFor={'form' + this.props.name}>{this.props.label}</Label>
			<input id={'form' + this.props.name} onClick={this.handleClick} placeholder={this.props.placeholder} className="c-field" value={this.state.value ? moment(this.state.value).format('dddd, MMMM Do YYYY') : ''} />
			{(()=>{
				if (this.state.calendarOpen) {
					return <Calendar onSelect={this.selectDate} value={this.state.value} />;
				}
			})()}
		</div>
	}

});