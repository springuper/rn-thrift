(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Thrift = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./constant":2}],2:[function(require,module,exports){
/**
 * Thrift IDL type string to Id mapping.
 * @readonly
 * @property {number}  STOP   - End of a set of fields.
 * @property {number}  VOID   - No value (only legal for return types).
 * @property {number}  BOOL   - True/False integer.
 * @property {number}  BYTE   - Signed 8 bit integer.
 * @property {number}  I08    - Signed 8 bit integer.     
 * @property {number}  DOUBLE - 64 bit IEEE 854 floating point.
 * @property {number}  I16    - Signed 16 bit integer.
 * @property {number}  I32    - Signed 32 bit integer.
 * @property {number}  I64    - Signed 64 bit integer.
 * @property {number}  STRING - Array of bytes representing a string of characters.
 * @property {number}  UTF7   - Array of bytes representing a string of UTF7 encoded characters.
 * @property {number}  STRUCT - A multifield type.
 * @property {number}  MAP    - A collection type (map/associative-array/dictionary).
 * @property {number}  SET    - A collection type (unordered and without repeated values).
 * @property {number}  LIST   - A collection type (unordered).
 * @property {number}  UTF8   - Array of bytes representing a string of UTF8 encoded characters.
 * @property {number}  UTF16  - Array of bytes representing a string of UTF16 encoded characters.
 */
exports.Type = {
  'STOP' : 0,
  'VOID' : 1,
  'BOOL' : 2,
  'BYTE' : 3,
  'I08' : 3,
  'DOUBLE' : 4,
  'I16' : 6,
  'I32' : 8,
  'I64' : 10,
  'STRING' : 11,
  'UTF7' : 11,
  'STRUCT' : 12,
  'MAP' : 13,
  'SET' : 14,
  'LIST' : 15,
  'UTF8' : 16,
  'UTF16' : 17,
};

/**
  * Thrift RPC message type string to Id mapping.
  * @readonly
  * @property {number}  CALL      - RPC call sent from client to server.
  * @property {number}  REPLY     - RPC call normal response from server to client.
  * @property {number}  EXCEPTION - RPC call exception response from server to client.
  * @property {number}  ONEWAY    - Oneway RPC call from client to server with no response.
  */
exports.MessageType = {
  'CALL' : 1,
  'REPLY' : 2,
  'EXCEPTION' : 3,
  'ONEWAY' : 4
};

},{}],3:[function(require,module,exports){
var util = rquire('./util');

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

},{}],4:[function(require,module,exports){
var constant = require('./constant');

/**
 * Initializes a Thrift JSON protocol instance.
 * @constructor
 * @param {Thrift.Transport} transport - The transport to serialize to/from.
 * @classdesc Apache Thrift Protocols perform serialization which enables cross 
 * language RPC. The Protocol type is the JavaScript browser implementation 
 * of the Apache Thrift TJSONProtocol.
 * @example
 *     var protocol  = new Thrift.Protocol(transport);
 */
var Protocol = function(transport) {
  this.tstack = [];
  this.tpos = [];
  this.transport = transport;
};

/**
 * Thrift IDL type Id to string mapping.
 * @readonly
 * @see {@link Thrift.Type}
 */
Protocol.Type = {};
Protocol.Type[constant.Type.BOOL] = '"tf"';
Protocol.Type[constant.Type.BYTE] = '"i8"';
Protocol.Type[constant.Type.I16] = '"i16"';
Protocol.Type[constant.Type.I32] = '"i32"';
Protocol.Type[constant.Type.I64] = '"i64"';
Protocol.Type[constant.Type.DOUBLE] = '"dbl"';
Protocol.Type[constant.Type.STRUCT] = '"rec"';
Protocol.Type[constant.Type.STRING] = '"str"';
Protocol.Type[constant.Type.MAP] = '"map"';
Protocol.Type[constant.Type.LIST] = '"lst"';
Protocol.Type[constant.Type.SET] = '"set"';

/**
 * Thrift IDL type string to Id mapping.
 * @readonly
 * @see {@link Thrift.Type}
 */
Protocol.RType = {};
Protocol.RType.tf = constant.Type.BOOL;
Protocol.RType.i8 = constant.Type.BYTE;
Protocol.RType.i16 = constant.Type.I16;
Protocol.RType.i32 = constant.Type.I32;
Protocol.RType.i64 = constant.Type.I64;
Protocol.RType.dbl = constant.Type.DOUBLE;
Protocol.RType.rec = constant.Type.STRUCT;
Protocol.RType.str = constant.Type.STRING;
Protocol.RType.map = constant.Type.MAP;
Protocol.RType.lst = constant.Type.LIST;
Protocol.RType.set = constant.Type.SET;

/**
 * The TJSONProtocol version number.
 * @readonly
 * @const {number} Version
 * @memberof Protocol
 */
Protocol.Version = 1;

Protocol.prototype = {
  /**
   * Returns the underlying transport.
   * @readonly
   * @returns {Transport} The underlying transport.
   */ 
  getTransport: function() {
    return this.transport;
  },

  /**
   * Serializes the beginning of a Thrift RPC message.
   * @param {string} name - The service method to call.
   * @param {constant.MessageType} messageType - The type of method call.
   * @param {number} seqid - The sequence number of this call (always 0 in Apache Thrift).
   */
  writeMessageBegin: function(name, messageType, seqid) {
    this.tstack = [];
    this.tpos = [];

    this.tstack.push([Protocol.Version, '"' +
      name + '"', messageType, seqid]);
  },

  /**
   * Serializes the end of a Thrift RPC message.
   */
  writeMessageEnd: function() {
    var obj = this.tstack.pop();

    this.wobj = this.tstack.pop();
    this.wobj.push(obj);

    this.wbuf = '[' + this.wobj.join(',') + ']';

    this.transport.write(this.wbuf);
  },

  /**
   * Serializes the beginning of a struct.
   * @param {string} name - The name of the struct.
   */
  writeStructBegin: function(name) {
    this.tpos.push(this.tstack.length);
    this.tstack.push({});
  },

  /**
   * Serializes the end of a struct.
   */
  writeStructEnd: function() {
    var p = this.tpos.pop();
    var struct = this.tstack[p];
    var str = '{';
    var first = true;
    for (var key in struct) {
      if (first) {
        first = false;
      } else {
        str += ',';
      }

      str += key + ':' + struct[key];
    }

    str += '}';
    this.tstack[p] = str;
  },

  /**
   * Serializes the beginning of a struct field.
   * @param {string} name - The name of the field.
   * @param {Protocol.Type} fieldType - The data type of the field.
   * @param {number} fieldId - The field's unique identifier.
   */
  writeFieldBegin: function(name, fieldType, fieldId) {
    this.tpos.push(this.tstack.length);
    this.tstack.push({ 'fieldId': '"' +
      fieldId + '"', 'fieldType': Protocol.Type[fieldType]
    });
  },

  /**
   * Serializes the end of a field.
   */
  writeFieldEnd: function() {
    var value = this.tstack.pop();
    var fieldInfo = this.tstack.pop();

    this.tstack[this.tstack.length - 1][fieldInfo.fieldId] = '{' +
      fieldInfo.fieldType + ':' + value + '}';
    this.tpos.pop();
  },

  /**
   * Serializes the end of the set of fields for a struct.
   */
  writeFieldStop: function() {},

  /**
   * Serializes the beginning of a map collection.
   * @param {constant.Type} keyType - The data type of the key.
   * @param {constant.Type} valType - The data type of the value.
   * @param {number} [size] - The number of elements in the map (ignored).
   */
  writeMapBegin: function(keyType, valType, size) {
    this.tpos.push(this.tstack.length);
    this.tstack.push([Protocol.Type[keyType],
      Protocol.Type[valType], 0]);
  },

  /**
   * Serializes the end of a map.
   */
  writeMapEnd: function() {
    var p = this.tpos.pop();

    if (p == this.tstack.length) {
      return;
    }

    if ((this.tstack.length - p - 1) % 2 !== 0) {
      this.tstack.push('');
    }

    var size = (this.tstack.length - p - 1) / 2;

    this.tstack[p][this.tstack[p].length - 1] = size;

    var map = '}';
    var first = true;
    while (this.tstack.length > p + 1) {
      var v = this.tstack.pop();
      var k = this.tstack.pop();
      if (first) {
        first = false;
      } else {
        map = ',' + map;
      }

      if (! isNaN(k)) { k = '"' + k + '"'; } //json "keys" need to be strings
      map = k + ':' + v + map;
    }
    map = '{' + map;

    this.tstack[p].push(map);
    this.tstack[p] = '[' + this.tstack[p].join(',') + ']';
  },

  /**
   * Serializes the beginning of a list collection.
   * @param {constant.Type} elemType - The data type of the elements.
   * @param {number} size - The number of elements in the list.
   */
  writeListBegin: function(elemType, size) {
    this.tpos.push(this.tstack.length);
    this.tstack.push([Protocol.Type[elemType], size]);
  },

  /**
   * Serializes the end of a list.
   */
  writeListEnd: function() {
    var p = this.tpos.pop();

    while (this.tstack.length > p + 1) {
      var tmpVal = this.tstack[p + 1];
      this.tstack.splice(p + 1, 1);
      this.tstack[p].push(tmpVal);
    }

    this.tstack[p] = '[' + this.tstack[p].join(',') + ']';
  },

  /**
   * Serializes the beginning of a set collection.
   * @param {constant.Type} elemType - The data type of the elements.
   * @param {number} size - The number of elements in the list.
   */
  writeSetBegin: function(elemType, size) {
    this.tpos.push(this.tstack.length);
    this.tstack.push([Protocol.Type[elemType], size]);
  },

  /**
   * Serializes the end of a set.
   */
  writeSetEnd: function() {
    var p = this.tpos.pop();

    while (this.tstack.length > p + 1) {
      var tmpVal = this.tstack[p + 1];
      this.tstack.splice(p + 1, 1);
      this.tstack[p].push(tmpVal);
    }

    this.tstack[p] = '[' + this.tstack[p].join(',') + ']';
  },

  /** Serializes a boolean */
  writeBool: function(value) {
    this.tstack.push(value ? 1 : 0);
  },

  /** Serializes a number */
  writeByte: function(i8) {
    this.tstack.push(i8);
  },

  /** Serializes a number */
  writeI16: function(i16) {
    this.tstack.push(i16);
  },

  /** Serializes a number */
  writeI32: function(i32) {
    this.tstack.push(i32);
  },

  /** Serializes a number */
  writeI64: function(i64) {
    this.tstack.push(i64);
  },

  /** Serializes a number */
  writeDouble: function(dbl) {
    this.tstack.push(dbl);
  },

  /** Serializes a string */
  writeString: function(str) {
    // We do not encode uri components for wire transfer:
    if (str === null) {
      this.tstack.push(null);
    } else {
      // concat may be slower than building a byte buffer
      var escapedString = '';
      for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);      // a single double quote: "
        if (ch === '\"') {
          escapedString += '\\\"'; // write out as: \"
        } else if (ch === '\\') {    // a single backslash
          escapedString += '\\\\'; // write out as double backslash 
        } else if (ch === '\b') {    // a single backspace: invisible
          escapedString += '\\b';  // write out as: \b"
        } else if (ch === '\f') {    // a single formfeed: invisible
          escapedString += '\\f';  // write out as: \f"
        } else if (ch === '\n') {    // a single newline: invisible
          escapedString += '\\n';  // write out as: \n"
        } else if (ch === '\r') {    // a single return: invisible
          escapedString += '\\r';  // write out as: \r"
        } else if (ch === '\t') {    // a single tab: invisible
          escapedString += '\\t';  // write out as: \t"
        } else {
          escapedString += ch;     // Else it need not be escaped
        }
      }
      this.tstack.push('"' + escapedString + '"');
    }
  },

  /** Serializes a string */
  writeBinary: function(binary) {
    var str = '';
    if (typeof binary == 'string') {
      str = binary;
    } else if (binary instanceof Uint8Array) {
      var arr = binary;
      for (var i = 0; i < arr.length; ++i) {
        str += String.fromCharCode(arr[i]);
      }
    } else {
      throw new TypeError('writeBinary only accepts String or Uint8Array.');
    }
    this.tstack.push('"' + btoa(str) + '"');
  },

  /** 
   * Deserializes the beginning of a message. 
   * @returns {object}
   */
  readMessageBegin: function() {
    this.rstack = [];
    this.rpos = [];

    if (typeof JSON !== 'undefined' && typeof JSON.parse === 'function') {
      this.robj = JSON.parse(this.transport.readAll());
    } else {
      this.robj = eval(this.transport.readAll());
    }

    var r = {};
    var version = this.robj.shift();

    if (version != Protocol.Version) {
      throw 'Wrong thrift protocol version: ' + version;
    }

    r.fname = this.robj.shift();
    r.mtype = this.robj.shift();
    r.rseqid = this.robj.shift();

    //get to the main obj
    this.rstack.push(this.robj.shift());

    return r;
  },

  /** Deserializes the end of a message. */
  readMessageEnd: function() {},

  /** 
    * Deserializes the beginning of a struct. 
    * @param {string} [name] - The name of the struct (ignored)
    * @returns {object} - An object with an empty string fname property
    */    
  readStructBegin: function(name) {
    var r = {};
    r.fname = '';

    //incase this is an array of structs
    if (this.rstack[this.rstack.length - 1] instanceof Array) {
      this.rstack.push(this.rstack[this.rstack.length - 1].shift());
    }

    return r;
  },

  /** Deserializes the end of a struct. */
  readStructEnd: function() {
    if (this.rstack[this.rstack.length - 2] instanceof Array) {
      this.rstack.pop();
    }
  },

  /** 
   * Deserializes the beginning of a field. 
   * @returns {object}
   */
  readFieldBegin: function() {
    var r = {};

    var fid = -1;
    var ftype = constant.Type.STOP;

    //get a fieldId
    for (var f in (this.rstack[this.rstack.length - 1])) {
      if (!this.rstack[this.rstack.length - 1].hasOwnProperty(f)) {
        continue;
      }

      fid = parseInt(f, 10);
      this.rpos.push(this.rstack.length);

      var field = this.rstack[this.rstack.length - 1][fid];

      //remove so we don't see it again
      delete this.rstack[this.rstack.length - 1][fid];

      this.rstack.push(field);

      break;
    }

    if (fid != -1) {
      //should only be 1 of these but this is the only
      //way to match a key
      for (var i in (this.rstack[this.rstack.length - 1])) {
        if (Protocol.RType[i] === undefined) {
          continue;
        }

        ftype = Protocol.RType[i];
        this.rstack[this.rstack.length - 1] =
          this.rstack[this.rstack.length - 1][i];
      }
    }

    r.fname = '';
    r.ftype = ftype;
    r.fid = fid;

    return r;
  },

  /** Deserializes the end of a field. */
  readFieldEnd: function() {
    var pos = this.rpos.pop();

    //get back to the right place in the stack
    while (this.rstack.length > pos) {
      this.rstack.pop();
    }
  },

  /** 
   * Deserializes the beginning of a map. 
   * @returns {object}
   */
  readMapBegin: function() {
    var map = this.rstack.pop();
    var first = map.shift();
    if (first instanceof Array) {
      this.rstack.push(map);
      map = first;
      first = map.shift();
    }

    var r = {};
    r.ktype = Protocol.RType[first];
    r.vtype = Protocol.RType[map.shift()];
    r.size = map.shift();

    this.rpos.push(this.rstack.length);
    this.rstack.push(map.shift());

    return r;
  },

  /** Deserializes the end of a map. */
  readMapEnd: function() {
    this.readFieldEnd();
  },

  /** 
   * Deserializes the beginning of a list. 
   * @returns {AnonReadColBeginReturn}
   */
  readListBegin: function() {
    var list = this.rstack[this.rstack.length - 1];

    var r = {};
    r.etype = Protocol.RType[list.shift()];
    r.size = list.shift();

    this.rpos.push(this.rstack.length);
    this.rstack.push(list.shift());

    return r;
  },

  /** Deserializes the end of a list. */
  readListEnd: function() {
    this.readFieldEnd();
  },

  /** 
   * Deserializes the beginning of a set. 
   * @returns {AnonReadColBeginReturn}
   */
  readSetBegin: function(elemType, size) {
    return this.readListBegin(elemType, size);
  },

  /** Deserializes the end of a set. */
  readSetEnd: function() {
    return this.readListEnd();
  },

  /**
   * Returns an object with a value property set to 
   * False unless the next number in the protocol buffer 
   * is 1, in which case the value property is True
   */
  readBool: function() {
    var r = this.readI32();

    if (r !== null && r.value == '1') {
      r.value = true;
    } else {
      r.value = false;
    }

    return r;
  },

  /** Returns the an object with a value property set to the 
      next value found in the protocol buffer */
  readByte: function() {
    return this.readI32();
  },

  /** Returns the an object with a value property set to the 
      next value found in the protocol buffer */
  readI16: function() {
    return this.readI32();
  },

  /** Returns the an object with a value property set to the 
      next value found in the protocol buffer */
  readI32: function(f) {
    if (f === undefined) {
      f = this.rstack[this.rstack.length - 1];
    }

    var r = {};

    if (f instanceof Array) {
      if (f.length === 0) {
        r.value = undefined;
      } else {
        r.value = f.shift();
      }
    } else if (f instanceof Object) {
      for (var i in f) {
        if (i === null) {
          continue;
        }
        this.rstack.push(f[i]);
        delete f[i];

        r.value = i;
        break;
      }
    } else {
      r.value = f;
      this.rstack.pop();
    }

    return r;
  },

  /** Returns the an object with a value property set to the 
      next value found in the protocol buffer */
  readI64: function() {
    return this.readI32();
  },

  /** Returns the an object with a value property set to the 
      next value found in the protocol buffer */
  readDouble: function() {
    return this.readI32();
  },

  /** Returns the an object with a value property set to the 
      next value found in the protocol buffer */
  readString: function() {
    var r = this.readI32();
    return r;
  },

  /** Returns the an object with a value property set to the 
      next value found in the protocol buffer */
  readBinary: function() {
    var r = this.readI32();
    r.value = atob(r.value);
    return r;
  },

  /** 
    * Method to arbitrarily skip over data */
  skip: function(type) {
    var ret, i;
    switch (type) {
    case constant.Type.STOP:
      return null;

    case constant.Type.BOOL:
      return this.readBool();

    case constant.Type.BYTE:
      return this.readByte();

    case constant.Type.I16:
      return this.readI16();

    case constant.Type.I32:
      return this.readI32();

    case constant.Type.I64:
      return this.readI64();

    case constant.Type.DOUBLE:
      return this.readDouble();

    case constant.Type.STRING:
      return this.readString();

    case constant.Type.STRUCT:
      this.readStructBegin();
      while (true) {
        ret = this.readFieldBegin();
        if (ret.ftype == constant.Type.STOP) {
          break;
        }
        this.skip(ret.ftype);
        this.readFieldEnd();
      }
      this.readStructEnd();
      return null;

    case constant.Type.MAP:
      ret = this.readMapBegin();
      for (i = 0; i < ret.size; i++) {
        if (i > 0) {
          if (this.rstack.length > this.rpos[this.rpos.length - 1] + 1) {
            this.rstack.pop();
          }
        }
        this.skip(ret.ktype);
        this.skip(ret.vtype);
      }
      this.readMapEnd();
      return null;

    case constant.Type.SET:
      ret = this.readSetBegin();
      for (i = 0; i < ret.size; i++) {
        this.skip(ret.etype);
      }
      this.readSetEnd();
      return null;

    case constant.Type.LIST:
      ret = this.readListBegin();
      for (i = 0; i < ret.size; i++) {
        this.skip(ret.etype);
      }
      this.readListEnd();
      return null;
    }
  }
};

module.exports = Protocol;

},{"./constant":2}],5:[function(require,module,exports){
var TJSONProtocol = require('./jsonProtocol');
var constant = require('./constant');

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


},{"./constant":2,"./jsonProtocol":4}],6:[function(require,module,exports){
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

},{"./multiplexProtocol":5}],7:[function(require,module,exports){
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
exports.Protocol = exports.TJSONProtocol = require('./jsonProtocol');
exports.MultiplexProtocol = require('./multiplexProtocol');
exports.Multiplexer = require('./multiplexer');

},{"./applicationException":1,"./exception":3,"./jsonProtocol":4,"./multiplexProtocol":5,"./multiplexer":6,"./util":8,"./websocketTransport":9,"./xhrTransport":10}],8:[function(require,module,exports){
/**
 * Utility function returning the count of an object's own properties.
 * @param {object} obj - Object to test.
 * @returns {number} number of object's own properties
 */
exports.objectLength = function(obj) {
  var length = 0;
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      length++;
    }
  }
  return length;
};

/**
 * Utility function to establish prototype inheritance.
 * @see {@link http://javascript.crockford.com/prototypal.html|Prototypal Inheritance}
 * @param {function} constructor - Contstructor function to set as derived.
 * @param {function} superConstructor - Contstructor function to set as base.
 * @param {string} [name] - Type name to set as name property in derived prototype.
 */
exports.inherits = function(constructor, superConstructor, name) {
  constructor.prototype = Object.create(superConstructor.prototype);
  constructor.prototype.name = name || "";
};

},{}],9:[function(require,module,exports){
/**
 * Constructor Function for the WebSocket transport.
 * @constructor
 * @param {string} [url] - The URL to connect to.
 * @classdesc The Apache Thrift Transport layer performs byte level I/O 
 * between RPC clients and servers. The JavaScript TWebSocketTransport object 
 * uses the WebSocket protocol. Target servers must implement WebSocket.
 * (see: node.js example server_http.js).
 * @example
 *   var transport = new Thrift.TWebSocketTransport("http://localhost:8585");
 */
var TWebSocketTransport = function(url) {
  this.__reset(url);
};

TWebSocketTransport.prototype = {
  __reset: function(url) {
    this.url = url;             //Where to connect
    this.socket = null;         //The web socket
    this.callbacks = [];        //Pending callbacks
    this.send_pending = [];     //Buffers/Callback pairs waiting to be sent
    this.send_buf = '';         //Outbound data, immutable until sent
    this.recv_buf = '';         //Inbound data
    this.rb_wpos = 0;           //Network write position in receive buffer
    this.rb_rpos = 0;           //Client read position in receive buffer
  },

  /**
   * Sends the current WS request and registers callback. The async 
   * parameter is ignored (WS flush is always async) and the callback 
   * function parameter is required.
   * @param {object} async - Ignored.
   * @param {object} callback - The client completion callback.
   * @returns {undefined|string} Nothing (undefined) 
   */
  flush: function(async, callback) {
    var self = this;
    if (this.isOpen()) {
      //Send data and register a callback to invoke the client callback
      this.socket.send(this.send_buf); 
      this.callbacks.push((function() {
        var clientCallback = callback;    
        return function(msg) {
          self.setRecvBuffer(msg);
          clientCallback();
        };
      }()));
    } else {
      //Queue the send to go out __onOpen
      this.send_pending.push({
        buf: this.send_buf,
        cb:  callback
      });
    }
  },

  __onOpen: function() { 
     var self = this;
     if (this.send_pending.length > 0) {
        //If the user made calls before the connection was fully 
        //open, send them now
        this.send_pending.forEach(function(elem) {
           this.socket.send(elem.buf);
           this.callbacks.push((function() {
             var clientCallback = elem.cb;    
             return function(msg) {
                self.setRecvBuffer(msg);
                clientCallback();
             };
           }()));
        });
        this.send_pending = [];
     }
  },
  
  __onClose: function(evt) { 
    this.__reset(this.url);
  },
   
  __onMessage: function(evt) {
    if (this.callbacks.length) {
      this.callbacks.shift()(evt.data);
    }
  },
   
  __onError: function(evt) { 
    // console.log("Thrift WebSocket Error: " + evt.toString());
    this.socket.close();
  },

  /**
   * Sets the buffer to use when receiving server responses.
   * @param {string} buf - The buffer to receive server responses.
   */
  setRecvBuffer: function(buf) {
      this.recv_buf = buf;
      this.recv_buf_sz = this.recv_buf.length;
      this.wpos = this.recv_buf.length;
      this.rpos = 0;
  },

  /**
   * Returns true if the transport is open
   * @readonly
   * @returns {boolean} 
   */    
  isOpen: function() {
      return this.socket && this.socket.readyState == this.socket.OPEN;
  },

  /**
   * Opens the transport connection
   */    
  open: function() {
    //If OPEN/CONNECTING/CLOSING ignore additional opens
    if (this.socket && this.socket.readyState != this.socket.CLOSED) {
      return;
    }
    //If there is no socket or the socket is closed:
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this.__onOpen.bind(this); 
    this.socket.onmessage = this.__onMessage.bind(this); 
    this.socket.onerror = this.__onError.bind(this); 
    this.socket.onclose = this.__onClose.bind(this); 
  },

  /**
   * Closes the transport connection
   */    
  close: function() {
    this.socket.close();
  },

  /**
   * Returns the specified number of characters from the response
   * buffer.
   * @param {number} len - The number of characters to return.
   * @returns {string} Characters sent by the server.
   */
  read: function(len) {
      var avail = this.wpos - this.rpos;

      if (avail === 0) {
          return '';
      }

      var give = len;

      if (avail < len) {
          give = avail;
      }

      var ret = this.read_buf.substr(this.rpos, give);
      this.rpos += give;

      //clear buf when complete?
      return ret;
  },

  /**
   * Returns the entire response buffer.
   * @returns {string} Characters sent by the server.
   */
  readAll: function() {
      return this.recv_buf;
  },

  /**
   * Sets the send buffer to buf.
   * @param {string} buf - The buffer to send.
   */    
  write: function(buf) {
      this.send_buf = buf;
  },

  /**
   * Returns the send buffer.
   * @readonly
   * @returns {string} The send buffer.
   */ 
  getSendBuffer: function() {
      return this.send_buf;
  }
};

module.exports = TWebSocketTransport;

},{}],10:[function(require,module,exports){
/**
 * Constructor Function for the XHR transport.
 * If you do not specify a url then you must handle XHR operations on
 * your own. This type can also be constructed using the Transport alias
 * for backward compatibility.
 * @constructor
 * @param {string} [url] - The URL to connect to.
 * @classdesc The Apache Thrift Transport layer performs byte level I/O 
 * between RPC clients and servers. The JavaScript TXHRTransport object 
 * uses Http[s]/XHR. Target servers must implement the http[s] transport
 * (see: node.js example server_http.js).
 * @example
 *     var transport = new Thrift.TXHRTransport("http://localhost:8585");
 */
var TXHRTransport = function(url, options) {
  this.url = url;
  this.wpos = 0;
  this.rpos = 0;
  this.useCORS = (options && options.useCORS);
  this.send_buf = '';
  this.recv_buf = '';
};

TXHRTransport.prototype = {
  /**
   * Gets the browser specific XmlHttpRequest Object.
   * @returns {object} the browser XHR interface object
   */
  getXmlHttpRequestObject: function() {
    // TODO XML or fetch?
    try { return new XMLHttpRequest(); } catch (e) { }

    throw "Your browser doesn't support XHR.";
  },

  /**
   * Sends the current XRH request if the transport was created with a URL 
   * and the async parameter is false. If the transport was not created with
   * a URL, or the async parameter is True and no callback is provided, or 
   * the URL is an empty string, the current send buffer is returned.
   * @param {object} async - If true the current send buffer is returned.
   * @param {object} callback - Optional async completion callback 
   * @returns {undefined|string} Nothing or the current send buffer.
   * @throws {string} If XHR fails.
   */
  flush: function(async, callback) {
    var self = this;
    if ((async && !callback) || this.url === undefined || this.url === '') {
      return this.send_buf;
    }

    var xreq = this.getXmlHttpRequestObject();

    if (xreq.overrideMimeType) {
      xreq.overrideMimeType('application/vnd.apache.thrift.json; charset=utf-8');
    }

    if (callback) {
      // Ignore XHR callbacks until the data arrives, then call the
      // client's callback
      xreq.onreadystatechange = (function() {
        var clientCallback = callback;    
        return function() {
          if (this.readyState == 4 && this.status == 200) {
            self.setRecvBuffer(this.responseText);
            clientCallback();
          }
        };
      }());

      // detect net::ERR_CONNECTION_REFUSED and call the callback.
      xreq.onerror = (function() {
        var clientCallback = callback;
        return function() {
          clientCallback();
        };
      }());
    }

    xreq.open('POST', this.url, !!async);

    if (xreq.setRequestHeader) {
      xreq.setRequestHeader('Accept', 'application/vnd.apache.thrift.json; charset=utf-8');
      xreq.setRequestHeader('Content-Type', 'application/vnd.apache.thrift.json; charset=utf-8');
    }

    xreq.send(this.send_buf);
    if (async && callback) {
      return;
    }

    if (xreq.readyState != 4) {
      throw 'encountered an unknown ajax ready state: ' + xreq.readyState;
    }

    if (xreq.status != 200) {
      throw 'encountered a unknown request status: ' + xreq.status;
    }

    this.recv_buf = xreq.responseText;
    this.recv_buf_sz = this.recv_buf.length;
    this.wpos = this.recv_buf.length;
    this.rpos = 0;
  },

  /**
   * Sets the buffer to provide the protocol when deserializing.
   * @param {string} buf - The buffer to supply the protocol.
   */
  setRecvBuffer: function(buf) {
    this.recv_buf = buf;
    this.recv_buf_sz = this.recv_buf.length;
    this.wpos = this.recv_buf.length;
    this.rpos = 0;
  },

  /**
   * Returns true if the transport is open, XHR always returns true.
   * @readonly
   * @returns {boolean} Always True.
   */    
  isOpen: function() {
    return true;
  },

  /**
   * Opens the transport connection, with XHR this is a nop.
   */    
  open: function() {},

  /**
   * Closes the transport connection, with XHR this is a nop.
   */    
  close: function() {},

  /**
   * Returns the specified number of characters from the response
   * buffer.
   * @param {number} len - The number of characters to return.
   * @returns {string} Characters sent by the server.
   */
  read: function(len) {
    var avail = this.wpos - this.rpos;

    if (avail === 0) {
      return '';
    }

    var give = len;

    if (avail < len) {
      give = avail;
    }

    var ret = this.read_buf.substr(this.rpos, give);
    this.rpos += give;

    //clear buf when complete?
    return ret;
  },

  /**
   * Returns the entire response buffer.
   * @returns {string} Characters sent by the server.
   */
  readAll: function() {
    return this.recv_buf;
  },

  /**
   * Sets the send buffer to buf.
   * @param {string} buf - The buffer to send.
   */    
  write: function(buf) {
    this.send_buf = buf;
  },

  /**
   * Returns the send buffer.
   * @readonly
   * @returns {string} The send buffer.
   */ 
  getSendBuffer: function() {
    return this.send_buf;
  }
};

module.exports = TXHRTransport;

},{}]},{},[7])(7)
});