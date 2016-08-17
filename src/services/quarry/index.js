'use strict';

const service = require('feathers-mongoose');
const quarry = require('./quarry-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: quarry,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/quarries', service(options));

  // Get our initialize service to that we can bind hooks
  const quarryService = app.service('/quarries');

  // Set up our before hooks
  quarryService.before(hooks.before);

  // Set up our after hooks
  quarryService.after(hooks.after);
};
