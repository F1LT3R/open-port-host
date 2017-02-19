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

    resolve({
      port: port,
      server: server
    });
  });
});

const findPort = options => new Promise((resolve, reject) => {
  const {start, end, host, debug, count} = options;

  const activeServers = [];
  let portsToTry = [];

  if (!count) {
    count = 1;
  }


  if (debug) {
    console.log(`openporthost - {start: ${start}, end: ${end}, host: ${host}, count: ${count}}`);
  }

  const fire = () => new Promise((resolve, reject) => {
    if (portsToTry.length > 0) {
      const port = portsToTry.shift();

      return tryServer({port, host, debug}).then(result => {
        if (result instanceof Error) {
          return resolve(fire());
        }

        if (typeof result.port === 'number' &&
          result.port > -1) {
          if (debug) {
            console.log(`found open port: ${port}, ${host}`);
          }

        activeServers.push(result);

          if (activeServers.length >= count) {
          portsToTry = [];
          return resolve(activeServers);
          }
        }

        resolve(fire());
      });
    }

    reject(`No port found in range ${start} - ${end}`);
  });

  let n = start;
  while (n < end + 1) {
    portsToTry.push(n);
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
//   debug: true,
//   count: 2
// };

// findPort(options).then(reservedAddresses => {
//   console.log(reservedAddresses);
// }).catch(err => {
//   throw err;
// });
