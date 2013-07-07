// Listen for only the first of the specified
// events on an event emitter.
//
// Useful for listening for 'connect' or
// 'error' events while connecting, but
//
// * emitter = some form of EventEmitter
// * events = array of event names
// * callback = function (event, args)
module.exports = function event_race(emitter, events, callback) {
  var handlers = {};
  events.forEach(function (e) {

    handlers[e] = function () {
      Object.keys(handlers).forEach(function (eh) {
        emitter.removeListener(eh, handlers[eh]);
      });
      callback.call(this, e, Array.prototype.slice.call(arguments, 0));
    };

    emitter.on(e, handlers[e]);
  });
}

