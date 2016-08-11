'use strict';

const service = require('feathers-mongoose');
const bookings = require('./bookings-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: bookings,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/bookings', service(options));

  // Get our initialize service to that we can bind hooks
  const bookingsService = app.service('/bookings');

  // Set up our before hooks
  bookingsService.before(hooks.before);

  // Set up our after hooks
  bookingsService.after(hooks.after);
};
