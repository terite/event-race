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

  it('less-boilerplate way should work', function (done) {
    var ee = new EventEmitter;
    race(ee, {
      foo: function () {
        assert.fail('foo called', 'bar called');
      },
      bar: function (one, two) {
        assert.equal(one, 1);
        assert.equal(two, 2);
        done();
      },
      baz: function () {
        assert.fail('baz called', 'bar called');
      }
    });

    process.nextTick(function () {
      ee.emit('bar', 1, 2);
      ee.emit('foo', 1, 2);
      ee.emit('baz', 1, 2);
    });
  });

  it('should keep racing sometimes', function (done) {
    var ee = new EventEmitter;
    var first_was_called = false;
    race(ee, {
      first: function () {
        first_was_called = true;
        return 'keep racing';
      },
      second: function () {
        assert(first_was_called);
        done();
      }
    });

    process.nextTick(function() {
      ee.emit('first');
      ee.emit('second');
    });
  });
});
