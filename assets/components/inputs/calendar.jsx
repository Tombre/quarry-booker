import React from 'react';
import _ from 'lodash';
import moment from 'moment';

const currentDate = moment();

export default React.createClass({

	propTypes: {
		value: React.PropTypes.string,
		onSelect: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			value: this.props.value ? moment(this.props.value) : null,
			date: this.props.value ? moment(this.props.value) : moment()
		};
	},

	selectDate: function(date) {
		this.setState({ value: date });
		this.props.onSelect(date.toISOString());
	},

	handleDateClick: function(date, event) {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		this.selectDate(date);
	},

	handleMonthChange: function(direction, event) {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		let method = direction > 0 ? 'add' : 'subtract';
		this.setState({ date : this.state.date.clone()[method](1, 'months') });
	},

	handleSelectToday: function(event) {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		this.selectDate(moment());
	},

	render: function() {

		let days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		let style = {
			// 'position': 'absolute',
			// 'top': '90%',
			// 'left': 0
		};

		return <div className="c-calendar c-calendar--higher a-calendar" style={style}>

			<button className="c-calendar__control" onClick={_.partial(this.handleMonthChange, -1)}>‹</button>
			<div className="c-calendar__header">{this.state.date.format('MMMM')} - {this.state.date.year()}</div>
			<button className="c-calendar__control" onClick={_.partial(this.handleMonthChange, 1)}>›</button>

			{days.map(name => <div className="c-calendar__day" key={name}>{name}</div>)}

			{(() => {
				
				let month = moment(this.state.date.clone().startOf('month'));
				let dateToBegin = month.clone().day(0);
				let dateToFinish = month.clone().date(month.daysInMonth()).day(6)

				let dateTracker = dateToBegin.clone();
				let rendered = [];
				while(!dateTracker.isSame(dateToFinish, 'day')) {
					
					let btnClass = 'c-calendar__date';
					let className = btnClass;
					
					if (dateTracker.isSame(month, 'month')) className += ` ${btnClass}--in-month`;
					if (dateTracker.isSame(this.state.value, 'day')) className += ` ${btnClass}--selected`;
					
					rendered.push(
						<button key={dateTracker.dayOfYear()} onClick={_.partial(this.handleDateClick, dateTracker.clone())} className={className}>{dateTracker.date()}</button>
					);
					
					dateTracker.add(1, 'days');
				}

				return rendered;

			})()}

			<button className="c-button c-button--block c-button--primary" onClick={this.handleSelectToday}>Selet today</button>

		</div>
	}

});