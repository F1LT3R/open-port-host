const net = require('net');
const chai = require('chai');

const expect = chai.expect;

const findPortHost = require('../index.js');

describe('test-port-host', () => {
  it('should not find an open port when port is already used', done => {
    const options = {
      // debug: true,
      start: 8000,
      end: 8016,
      host: 'localhost'
    };

    findPortHost(options)
    .then(port => {
      const server = net.createServer();
      server.listen({port, host: options.host}, () => {
        const options2 = {
          start: port,
          end: port,
          host: options.host
        };

        findPortHost(options2)
        .catch(err => { // eslint-disable-line max-nested-callbacks
          expect(err).to.be.a('string');
          expect(err).to.equal(`No port found in range ${port} - ${port}`);
          server.close();
          done();
        });
      });
    });
  });
});
