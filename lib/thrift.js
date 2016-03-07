var util = require('./util');

var Thrift = {
  /**
   * Thrift React Native library version.
   * @readonly
   * @const {string} Version
   * @memberof Thrift
   */
  Version: '0.1.0',
};

module.exports = Thrift;
exports.TException = require('./exception');
exports.TApplicationException = require('./applicationException').TApplicationException;
exports.TApplicationExceptionType = require('./applicationException').TApplicationExceptionType;
exports.TXHRTransport = require('./xhrTransport');
exports.TWebSocketTransport = require('./websocketTransport');
exports.TJSONProtocol = require('./jsonProtocol');
exports.TMultiplexProtocol = require('./multiplexProtocol');

/**
 * Initializes a MutilplexProtocol Implementation as a Wrapper for Thrift.Protocol
 * @constructor
 */
exports.MultiplexProtocol = function (srvName, trans, strictRead, strictWrite) {
    exports.TJSONProtocol.call(this, trans, strictRead, strictWrite);
    this.serviceName = srvName;
};
util.inherits(exports.MultiplexProtocol, Thrift.TJSONProtocol, 'multiplexProtocol');

/** Override writeMessageBegin method of prototype*/
exports.MultiplexProtocol.prototype.writeMessageBegin = function (name, type, seqid) {
  if (type === constant.MessageType.CALL || type === constant.MessageType.ONEWAY) {
    exports.TJSONProtocol.prototype.writeMessageBegin.call(this, this.serviceName + ":" + name, type, seqid);
  } else {
    exports.TJSONProtocol.prototype.writeMessageBegin.call(this, name, type, seqid);
  }
};

exports.Multiplexer = function () {
  this.seqid = 0;
};

/**
 * Instantiates a multiplexed client for a specific service
 * @constructor
 * @param {String} serviceName - The transport to serialize to/from.
 * @param {Thrift.ServiceClient} SCl - The Service Client Class
 * @param {Thrift.Transport} transport - Thrift.Transport instance which provides remote host:port
 * @example
 *    var mp = new Thrift.Multiplexer();
 *    var transport = new Thrift.Transport("http://localhost:9090/foo.thrift");
 *    var protocol = new Thrift.Protocol(transport);
 *    var client = mp.createClient('AuthService', AuthServiceClient, transport);
*/
exports.Multiplexer.prototype.createClient = function (serviceName, SCl, transport) {
  if (SCl.Client) {
    SCl = SCl.Client;
  }
  var self = this;
  SCl.prototype.new_seqid = function () {
    self.seqid += 1;
    return self.seqid;
  };
  var client = new SCl(new exports.MultiplexProtocol(serviceName, transport));

  return client;
};
