## event-race

### What
Listen for only the first of the specified
events on an event emitter.

Useful for listening for 'connect' or 'error'
events while connecting, but not firing those
callbacks again for any other situation.

### How to use
```js
var race = require('event-race'),
    stream = net.connect(1337, 'example-host');

race(stream, ['connect', 'error'], function (winner, args) {
    if (winner == 'connect') {
        // Successful connection
    } else {
        // Error while connecting
    }
});
```
There's also a less-boilerplate way
```js
var race = require('event-race'),
    stream = net.connect(1337, 'example-host');

race(stream, {
    connect: function () { /* Successful connection */ }
    error: function (e) { /* Error while connecting */ }
});
```

