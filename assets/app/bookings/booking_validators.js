import makeRule from 'makerule';
import moment from 'moment';

/*----------------------------------------------------------
	Validators
----------------------------------------------------------*/

export const bookingDateRule = makeRule.rule().required().isString().testWith('greaterThenToday', value => {
	moment(value).isSameOrAfter(moment())
});

export const phoneNumberRule = makeRule.rule().required().isNumber().testWith('greaterThenToday', value => {
	moment(value).isSameOrAfter(moment())
});