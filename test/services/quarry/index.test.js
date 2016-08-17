'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('quarry service', function() {
  it('registered the quarries service', () => {
    assert.ok(app.service('quarries'));
  });
});
