import mori from 'mori';
import _ from 'lodash';
import { selectPath, createSelector } from 'store/utils';

/*----------------------------------------------------------
	selectors
----------------------------------------------------------*/

export const selectBooking = createSelector(selectPath('BOOKING'));
export const selectError = createSelector(selectPath('BOOKING', 'error'));
export const selectSuccess = createSelector(selectPath('BOOKING', 'success'));