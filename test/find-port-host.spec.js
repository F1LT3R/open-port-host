const chai = require('chai');

const expect = chai.expect;

const findPortHost = require('app/index.js');

describe('test-port-host', () => {
  it('should find an open port between 8000 and 9000 on localhost', done => {
    const options = {
      start: 8000,
      end: 9000,
      host: 'localhost'
    };

    findPortHost.find(options).then(port => {
      expect(port).to.be.a('number');
      expect(port).to.be.greaterThan(-1);
      done();
    });
  });
});
