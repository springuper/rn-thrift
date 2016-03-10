var TJSONProtocol = require('./jsonProtocol');
var constant = require('./constant');
var util = require('./util');

/**
 * Initializes a MutilplexProtocol Implementation as a Wrapper for Thrift.Protocol
 * @constructor
 */
var MultiplexProtocol = function (srvName, trans, strictRead, strictWrite) {
    TJSONProtocol.call(this, trans, strictRead, strictWrite);
    this.serviceName = srvName;
};
util.inherits(MultiplexProtocol, TJSONProtocol, 'multiplexProtocol');

/** Override writeMessageBegin method of prototype*/
MultiplexProtocol.prototype.writeMessageBegin = function (name, type, seqid) {
  if (type === constant.MessageType.CALL || type === constant.MessageType.ONEWAY) {
    TJSONProtocol.prototype.writeMessageBegin.call(this, this.serviceName + ":" + name, type, seqid);
  } else {
    TJSONProtocol.prototype.writeMessageBegin.call(this, name, type, seqid);
  }
};

module.exports = MultiplexProtocol;

