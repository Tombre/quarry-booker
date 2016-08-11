'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('bookings service', function() {
  it('registered the bookings service', () => {
    assert.ok(app.service('bookings'));
  });
});
