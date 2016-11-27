# open-port-host
Find the first open port in a range by host name.


Example:

```javascript
const findPortHost = require('find-port-host');

const options = {
  start: 8000,
  end: 8100,
  host: 'localhost'
};

findPortHost(options)
  .then(port => {
    console.log(`Found port: ${port}`);
  })
  .catch(err => {
    throw new Error(err);
  });
```