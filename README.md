# open-port-host

Find a number of open ports in a range by host name.

Example:

```javascript
const findPortHost = require('find-port-host');

const options = {
  start: 8000,
  end: 8100,
  host: 'localhost',
  count: 2
};

findPortHost(options)
  .then(reserved => {
    console.log(`Found ports and reserved the following:`);
    console.log(reserved);
   		// Outputs the following. 
		// [ { port: 8002,
		//     server:
		//      Server {
		//        domain: null,
		//        _events: [Object],
		//        _eventsCount: 1,
		//        _maxListeners: undefined,
		//        _connections: 0,
		//        _handle: [Object],
		//        _usingSlaves: false,
		//        _slaves: [],
		//        _unref: false,
		//        allowHalfOpen: false,
		//        pauseOnConnect: false,
		//        _connectionKey: '4:127.0.0.1:8002' } },
		//   { port: 8003,
		//     server:
		//      Server {
		//        domain: null,
		//        _events: [Object],
		//        _eventsCount: 1,
		//        _maxListeners: undefined,
		//        _connections: 0,
		//        _handle: [Object],
		//        _usingSlaves: false,
		//        _slaves: [],
		//        _unref: false,
		//        allowHalfOpen: false,
		//        pauseOnConnect: false,
		//        _connectionKey: '4:127.0.0.1:8003' } } ]

  })
  .catch(err => {
    throw new Error(err);
  });
```

These ports are now closed (reserved), and passed back. To use the reserved addresses:

```javascript
findPortHost(options)
  .then(reserved => {
	reserved[0].server.once('close', () => {
		httpServer.listen(reserved[0].port, options.host);
	});

	reservedBrowserSyncAddress.server.close();
});
```