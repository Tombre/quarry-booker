import _ from 'lodash';
import Kefir from 'kefir';
import mori from 'mori';

/*----------------------------------------------------------
	Permissions
----------------------------------------------------------*/

export const isAnonymous = function(user) {
	return mori.get(user, 'username') === "";
};

export const isAdmin = function(user) {
	if ( mori.get(user, 'roles') && (mori.get(user, 'roles').indexOf("Admin") != -1 || mori.get(user, 'roles').indexOf("Superuser") != -1)) {
		return true;
	}
	return false;
};

export const hasPermission = function(user, permissions) {
	var roles = mori.get(user, "roles");
	if (_.isUndefined(roles)) {
		return false;
	}
	for (var i = permissions.length - 1; i >= 0; i--) {
		if (roles.indexOf(permissions[i]) >= 0) {
			return true;
		}
	}
	return false;
}

/*----------------------------------------------------------
	Computed Values
----------------------------------------------------------*/

export const getFullName = function(user) {
	var names = mori.get(user, 'names');
	if (names && names.length && names[0].length) {
		return names.join(' ');
	}
	return mori.get(user, 'email');
};

const avatarColours = ['#E7965C', '#E3744E', '#E7B760', '#94BA69', '#69A6BA', '#867DC5', '#C57D9E'];

// gets an avatar colour off its this users email
export const getAvatarColour = function(user, index) {
	var hash = _.hashCode(mori.get(user, 'email'));
	return (index ? avatarColours[index] : avatarColours[hash % avatarColours.length]);
};

// returns the short - (2 letter max) avatar ID of the user. This will use the name array by default but if that is not available, it will use the email address
export const getAvatarID = function(user) {
	var avatarID, names = mori.get(user, 'names'), email = mori.get(user, 'email');
	avatarID = (!_.isArray(names) || names.length === 0 || names[0].length === 0) ? [email] : names;
	avatarID = _.reduce(avatarID, function(memo, value) {
		return memo + value.slice(0, 1);
	}, '');
	return avatarID;
};

export const angleToDirection = function(angle) {
	var direction = '';
	if(angle >= 0 && angle < 11.25) {
		direction = 'N';
	}
	else if(angle >= 11.25 && angle < 33.75) {
		direction = 'NNE';
	}
	else if(angle >= 33.75 && angle < 56.25) {
		direction = 'NE';
	}
	else if(angle >= 56.25 && angle < 78.75) {
		direction = 'ENE';
	}
	else if(angle >= 78.75 && angle < 101.25) {
		direction = 'E';
	}
	else if(angle >= 101.25 && angle < 123.75) {
		direction = 'ESE';
	}
	else if(angle >= 123.75 && angle < 146.25) {
		direction = 'SE';
	}
	else if(angle >= 146.25 && angle < 168.75) {
		direction = 'SSE';
	}
	else if(angle >= 168.75 && angle < 191.25) {
		direction = 'S';
	}
	else if(angle >= 191.25 && angle < 213.75) {
		direction = 'SSW';
	}
	else if(angle >= 213.75 && angle < 236.25) {
		direction = 'SW';
	}
	else if(angle >= 236.25 && angle < 258.75) {
		direction = 'WSW';
	}
	else if(angle >= 258.75&& angle < 281.25) {
		direction = 'W';
	}
	else if(angle >= 281.25 && angle < 303.75) {
		direction = 'WNW';
	}
	else if(angle >= 303.75&& angle < 326.25) {
		direction = 'NW';
	}
	else if(angle >= 326.25 && angle < 348.75) {
		direction = 'NNW';
	}
	else if(angle >= 348.75 && angle < 360) {
		direction = 'N';
	}

	return direction;
}