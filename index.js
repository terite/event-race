module.exports = function (emitter, events, callback) {
  if (Array.isArray(events)) {
    return event_race_1(emitter, events, callback);
  }

  if (typeof events == 'object') {
    return event_race_2(emitter, events);
  }

  throw new Error('Unknown call style');
};

function removeListeners(emitter, handlers) {
  Object.keys(handlers).forEach(function (e) {
    emitter.removeListener(e, handlers[e]);
  });
}

function event_race_1(emitter, events, callback) {

  var handlers = {};
  events.forEach(function (e) {
    handlers[e] = function () {
      var result = callback.call(this, e, Array.prototype.slice.call(arguments, 0));
      if (result != 'keep raceing') removeListeners(emitter, handlers);
    };
    emitter.on(e, handlers[e]);
  });
}

function event_race_2(emitter, events) {
  var handlers = {};
  Object.keys(events).forEach(function (e) {
    var eh = events[e];
    handlers[e] = function () {
      var result = eh.apply(this, arguments);
      if (result != 'keep racing') removeListeners(emitter, handlers);
    };
    emitter.on(e, handlers[e]);
  });
}

