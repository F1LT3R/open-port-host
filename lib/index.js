const net = require('net');

const Promise = require('bluebird');

module.exports = options => new Promise((resolve, reject) => {
  const tryServer = options => new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(options, () => {
      server.once('close', () => {
        resolve(options.port);
      });
      server.close();
    });
  });

  const find = options => new Promise((resolve, reject) => {
    const {start, end, host} = options;

    let promises = [];
    let port = start;

    const halt = port => {
      promises = [];
      resolve(port);
    };

    const fire = () => {
      if (promises.length > 0) {
        const nextPromise = promises.shift();
        Promise.resolve(nextPromise)
          .then(halt).catch(fire);
      } else {
        reject(`No port found in range ${start} - ${end}`);
      }
    };

    while (port < end) {
      promises.push(tryServer({port, host}));
      port += 1;
    }

    fire();
  });

  find(options)
    .then(resolve)
    .catch(reject);
});
