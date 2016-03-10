var util = require('./util');

/**
 * Initializes a Thrift TException instance.
 * @constructor
 * @augments Error
 * @param {string} message - The TException message (distinct from the Error message).
 * @classdesc TException is the base class for all Thrift exceptions types.
 */
var TException = function(message) {
  this.message = message;
};
util.inherits(TException, Error, 'TException');

/**
 * Returns the message set on the exception.
 * @readonly
 * @returns {string} exception message
 */
TException.prototype.getMessage = function() {
  return this.message;
};

module.exports = TException;
