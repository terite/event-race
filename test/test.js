var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var race = require('../index.js');

describe('Event race', function () {
  it('should listen for events', function(done) {
    var ee = new EventEmitter;
    race(ee, ['foo', 'bar', 'baz'], function (winner, args) {
      assert.equal(winner, 'bar');
      assert.deepEqual(args, ['arg1', 'arg2']);
      done();
    });
    process.nextTick(function () {
      ee.emit('bar', 'arg1', 'arg2');
    });
  });

  it('should unbind after winner', function (done) {
    var ee = new EventEmitter,
        raceCalls = [];

    race(ee, ['foo', 'bar'], function (winner, args) {
      raceCalls.push(winner);
    });

    process.nextTick(function () {
      ee.emit('foo');
      ee.emit('foo');
      ee.emit('bar');
      assert.equal(raceCalls.length, 1);
      assert.deepEqual(raceCalls, ['foo']);
      done();
    });
  });
});
