const net = require('net');

const Promise = require('bluebird');

const tryServer = opts => new Promise(resolve => {
  const {port, host, debug} = opts;

  if (debug) {
    console.log(`tryServer: ${port}, ${host}`);
  }

  const server = net.createServer();

  // resolve undefined acts as continue
  server.on('error', resolve);

  server.listen(opts, () => {
    if (debug) {
      console.log(`listening on: ${port}, ${host})`);
    }
    server.once('close', () => {
      if (debug) {
        console.log(`closed: ${port}, ${host})`);
      }
      resolve(port);
    });
    server.close();
  });
});

const findPort = options => new Promise((resolve, reject) => {
  const {start, end, host, debug} = options;
  let ports = [];

  if (debug) {
    console.log(`openporthost - {start: ${start}, end: ${end}, host: ${host}}`);
  }

  const fire = () => new Promise((resolve, reject) => {
    if (ports.length > 0) {
      const port = ports.shift();

      return tryServer({port, host, debug}).then(result => {
        if (typeof result === 'number' && result > -1) {
          if (debug) {
            console.log(`found open port: ${port}, ${host}`);
          }
          ports = [];
          return resolve(result);
        }

        resolve(fire());
      });
    }

    reject(`No port found in range ${start} - ${end}`);
  });

  let n = start;
  while (n < end + 1) {
    ports.push(n);
    n += 1;
  }

  fire().then(resolve).catch(reject);
});

module.exports = findPort;

// EXAMPLE:

// const options = {
//   start: 8000,
//   end: 8004,
//   host: 'localhost',
//   debug: true
// };

// findPort(options).then(port => {
//   console.log(port);
// }).catch(err => {
//   throw err;
// });

