import React from 'react';
import Label from 'components/label';
import moment from 'moment';
import makeRule from 'makerule';
import ValidationError from 'components/validationError';

export default React.createClass({

	propTypes: {
		name: React.PropTypes.string,
		label: React.PropTypes.string,
		value: React.PropTypes.string,
	},

	getInitialState() {
		return {
			isSelecting: false,
			range: null,
		};
	},

	handleCardEnter: function(hourIndex) {
		if (!this.state.isSelecting) return;
		let range = [this.state.range[0], hourIndex];
		this.setState({ range });
	},

	handleMouseDown: function(hourIndex, e) {
		e.preventDefault();
		this.setState({ isSelecting: true, range: [hourIndex, hourIndex] });
		document.addEventListener('mouseup', this.handleMouseUp, false);	
	},

	handleMouseUp: function() {
		document.removeEventListener('mouseup', this.handleMouseUp, false);	
		this.setState({ isSelecting: false });
	},

	render: function() {

		console.log('hover', this.state.range);

		let hours =_.range(12);
		hours[0] = 12;
		let timeRange = hours.map(x => `${x} AM`).concat(hours.map(x => `${x} PM`));

		return <div className="c-form-element time-select">
			<Label htmlFor={'form' + this.props.name}>{this.props.label}</Label>

			{timeRange.map((time, hourIndex) => {
				let cardClass = 'c-card time-select__cards';
				let { range } = this.state;

				if (range && hourIndex >= Math.min.apply(null, range) && hourIndex <= Math.max.apply(null, range)) {
					cardClass += ' time-select__cards--selected';
				}

				return <div key={hourIndex} className={cardClass} onMouseDown={_.partial(this.handleMouseDown, hourIndex)} onMouseEnter={_.partial(this.handleCardEnter, hourIndex)}>
					<div className="c-card__content">
						<p className="c-paragraph">{time}</p>
					</div>
				</div>
			})}

		</div>
	}

});