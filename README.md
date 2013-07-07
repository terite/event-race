## event-race

### What it does
It attaches groups of event handlers to event emitters, and removes
them all once the first event has been emitted.

### Why is it useful?
Consider the following
```js
app.post('/sayhello', function (req, res) {
    var socket = net.connect(1337, 'helloserver');
    socket.on('connect', function () {
        res.send(200, 'said hello!');
        socket.write('Hello!');
    });
    socket.on('error', function () {
        res.send(500, 'error connecting');
    });
});
```
Both handlers call `res.send`, so only one can fire without a crash.
If `error` is emitted for any reason after `connect`, the app will
crash. Here's the alternative:

```js
var race = require('event-race');
app.post('/sayhello', function (req, res) {
    var socket = net.connect(1337, 'helloserver');
    race(socket, {
        connect: function () {
            res.send(200, 'said hello!');
            socket.write('Hello!');
        },
        error: function () {
            res.send(500, 'error connecting');
        }
    });
```

### Examples
1. Pass it an emitter, an array of event names, and a single handler.
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

2. Pass it an emitter and an object in the format {name: handler}

```js
var race = require('event-race'),
    stream = net.connect(1337, 'example-host');

race(stream, {
    connect: function () { /* Successful connection */ }
    error: function (e) { /* Error while connecting */ }
});
```
