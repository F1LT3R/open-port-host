const chai = require('chai');

const expect = chai.expect;

const findPortHost = require('app/index.js');

describe('test-port-host', () => {
  it('should find an open port between 8000 and 8100 on localhost', done => {
    const options = {
      start: 8000,
      end: 8100,
      host: 'localhost'
    };

    findPortHost(options).then(port => {
      expect(port).to.be.a('number');
      expect(port).to.be.greaterThan(-1);
      done();
    });
  });
});
