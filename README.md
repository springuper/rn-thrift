# RN-Thrift

React Native Thrift library.

RN-Thrift is based on thrift js implementation, but offers some more features:

- TBinaryProtocol, very useful for saving network payloads
- Modules, easier to maintain code
- Remove some useless code, such as jqRequest

# Install

```bash
npm install rn-thrift
```

# Usage

```js
const Thrift = require('rn-thrift');
const MyService = require('path/to/my/service');
const MyService_types = require('path/to/my/service/types');

const transport = new Thrift.TXHRTransport('/service/url');
const protocol = new Thrift.TBinaryProtocol(transport);
const client = new MyService.Client(protocol);
client.invokeSomeMethod('param', function (result) {
  console.log('result is', result);
});
```

# Contribute

## install PhantomJS

RN-Thrift uses PhantomJS to run all tests in local machine and travis CI, please install it referring to [office docs](http://phantomjs.org/download.html).

## install node modules

```bash
npm install
```

## start karma

```bash
karma start
```

## have fun~

# License

MIT.
