var MultiplexProtocol = require('./multiplexProtocol');

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
  var client = new SCl(new MultiplexProtocol(serviceName, transport));

  return client;
};
