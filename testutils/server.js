/* eslint no-console: 0 */
const thrift = require('thrift');
const hello_svc = require('./gen-nodejs/hello_svc');

const hello_handler = {
  getMessage: (name, result) => {
    console.log('Received Greeting call', name);
    result(null, `Hello ${name}!`);
  },
};

const port = 9090;

thrift.createWebServer({
  services: {
    '/hello': {
      handler: hello_handler,
      processor: hello_svc,
      protocol: thrift.TBinaryProtocol,
      transport: thrift.TBufferedTransport,
    },
  },
}).listen(port);                        		
console.log("Http/Thrift Server running on port: " + port);
