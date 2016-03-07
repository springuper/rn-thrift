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
