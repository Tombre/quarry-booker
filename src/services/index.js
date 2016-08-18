'use strict';

const quarry = require('./quarry');
const bookings = require('./bookings');
const authentication = require('./authentication');
const user = require('./user');
const booker = require('./booker');
const admin = require('./admin');
const mongoose = require('mongoose');

module.exports = function() {
    const app = this;

    mongoose.connect(app.get('mongodb'));

    mongoose.Promise = global.Promise;

    // VIEW
    app.configure(booker);
    app.configure(admin);

    // API
    app.configure(authentication);
    app.configure(user);
    app.configure(bookings);
    app.configure(quarry);

};
