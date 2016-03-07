var util = rquire('./util');
var TException = rquire('./exception');
var constant = require('./constant');

/**
 * Thrift Application Exception type string to Id mapping.
 * @readonly
 * @property {number}  UNKNOWN                 - Unknown/undefined.
 * @property {number}  UNKNOWN_METHOD          - Client attempted to call a method unknown to the server.
 * @property {number}  INVALID_MESSAGE_TYPE    - Client passed an unknown/unsupported MessageType.
 * @property {number}  WRONG_METHOD_NAME       - Unused.
 * @property {number}  BAD_SEQUENCE_ID         - Unused in Thrift RPC, used to flag proprietary sequence number errors.
 * @property {number}  MISSING_RESULT          - Raised by a server processor if a handler fails to supply the required return result.
 * @property {number}  INTERNAL_ERROR          - Something bad happened.
 * @property {number}  PROTOCOL_ERROR          - The protocol layer failed to serialize or deserialize data.
 * @property {number}  INVALID_TRANSFORM       - Unused.
 * @property {number}  INVALID_PROTOCOL        - The protocol (or version) is not supported.
 * @property {number}  UNSUPPORTED_CLIENT_TYPE - Unused.
 */
exports.TApplicationExceptionType = {
  'UNKNOWN' : 0,
  'UNKNOWN_METHOD' : 1,
  'INVALID_MESSAGE_TYPE' : 2,
  'WRONG_METHOD_NAME' : 3,
  'BAD_SEQUENCE_ID' : 4,
  'MISSING_RESULT' : 5,
  'INTERNAL_ERROR' : 6,
  'PROTOCOL_ERROR' : 7,
  'INVALID_TRANSFORM' : 8,
  'INVALID_PROTOCOL' : 9,
  'UNSUPPORTED_CLIENT_TYPE' : 10
};

/**
 * Initializes a Thrift TApplicationException instance.
 * @constructor
 * @augments TException
 * @param {string} message - The TApplicationException message (distinct from the Error message).
 * @param {TApplicationExceptionType} [code] - The TApplicationExceptionType code.
 * @classdesc TApplicationException is the exception class used to propagate exceptions from an RPC server back to a calling client.
*/
var TApplicationException = function(message, code) {
  this.message = message;
  this.code = typeof code === "number" ? code : 0;
};
util.inherits(TApplicationException, TException, 'TApplicationException');

/**
 * Read a TApplicationException from the supplied protocol.
 * @param {object} input - The input protocol to read from.
 */
TApplicationException.prototype.read = function(input) {
  while (1) {
    var ret = input.readFieldBegin();

    if (ret.ftype == constant.Type.STOP) {
      break;
    }

    var fid = ret.fid;

    switch (fid) {
    case 1:
      if (ret.ftype == constant.Type.STRING) {
        ret = input.readString();
        this.message = ret.value;
      } else {
        ret = input.skip(ret.ftype);
      }
      break;
    case 2:
      if (ret.ftype == constant.Type.I32) {
        ret = input.readI32();
        this.code = ret.value;
      } else {
        ret = input.skip(ret.ftype);
      }
      break;
    default:
      ret = input.skip(ret.ftype);
      break;
    }

    input.readFieldEnd();
  }

  input.readStructEnd();
};

/**
 * Wite a TApplicationException to the supplied protocol.
 * @param {object} output - The output protocol to write to.
 */
TApplicationException.prototype.write = function(output) {
  output.writeStructBegin('TApplicationException');

  if (this.message) {
    output.writeFieldBegin('message', constant.Type.STRING, 1);
    output.writeString(this.getMessage());
    output.writeFieldEnd();
  }

  if (this.code) {
    output.writeFieldBegin('type', constant.Type.I32, 2);
    output.writeI32(this.code);
    output.writeFieldEnd();
  }

  output.writeFieldStop();
  output.writeStructEnd();
};

/**
 * Returns the application exception code set on the exception.
 * @readonly
 * @returns {TApplicationExceptionType} exception code
 */
TApplicationException.prototype.getCode = function() {
  return this.code;
};
