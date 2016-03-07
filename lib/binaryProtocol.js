var binary = require('./binary');
var constant = require('./constant');
var Type = constant.Type;
var Buffer = require('buffer/').Buffer;
var Int64 = require('./int64');

module.exports = TBinaryProtocol;

// JavaScript supports only numeric doubles, therefore even hex values are always signed.
// The largest integer value which can be represented in JavaScript is +/-2^53.
// Bitwise operations convert numbers to 32 bit integers but perform sign extension
// upon assigning values back to variables.
var VERSION_MASK = -65536, // 0xffff0000
  VERSION_1 = -2147418112, // 0x80010000
  TYPE_MASK = 0x000000ff;

function TBinaryProtocol(trans, strictRead, strictWrite) {
  this.trans = trans;
  this.strictRead = (strictRead !== undefined ? strictRead : false);
  this.strictWrite = (strictWrite !== undefined ? strictWrite : true);
}

TBinaryProtocol.prototype.flush = function() {
  return this.trans.flush();
};

TBinaryProtocol.prototype.writeMessageBegin = function(name, type, seqid) {
  this.tstack = [];
  if (this.strictWrite) {
    this.writeI32(VERSION_1 | type);
    this.writeString(name);
    this.writeI32(seqid);
  } else {
    this.writeString(name);
    this.writeByte(type);
    this.writeI32(seqid);
  }
};

TBinaryProtocol.prototype.writeMessageEnd = function() {
  var count = this.tstack.reduce(function (sum, buf) {
    return sum + buf.length;
  }, 0);
  var outBuf = new Buffer(count);
  var pos = 0;
  this.tstack.forEach(function (buf) {
    buf.copy(outBuf, pos, 0);
    pos += buf.length;
  });
  this.trans.write(outBuf.toString('hex'));
};

TBinaryProtocol.prototype.writeStructBegin = function(name) {
};

TBinaryProtocol.prototype.writeStructEnd = function() {
};

TBinaryProtocol.prototype.writeFieldBegin = function(name, type, id) {
  this.writeByte(type);
  this.writeI16(id);
};

TBinaryProtocol.prototype.writeFieldEnd = function() {
};

TBinaryProtocol.prototype.writeFieldStop = function() {
  this.writeByte(Type.STOP);
};

TBinaryProtocol.prototype.writeMapBegin = function(ktype, vtype, size) {
  this.writeByte(ktype);
  this.writeByte(vtype);
  this.writeI32(size);
};

TBinaryProtocol.prototype.writeMapEnd = function() {
};

TBinaryProtocol.prototype.writeListBegin = function(etype, size) {
  this.writeByte(etype);
  this.writeI32(size);
};

TBinaryProtocol.prototype.writeListEnd = function() {
};

TBinaryProtocol.prototype.writeSetBegin = function(etype, size) {
  this.writeByte(etype);
  this.writeI32(size);
};

TBinaryProtocol.prototype.writeSetEnd = function() {
};

TBinaryProtocol.prototype.writeBool = function(bool) {
  if (bool) {
    this.writeByte(1);
  } else {
    this.writeByte(0);
  }
};

TBinaryProtocol.prototype.writeByte = function(b) {
  this.tstack.push(new Buffer([b]));
};

TBinaryProtocol.prototype.writeI16 = function(i16) {
  this.tstack.push(binary.writeI16(new Buffer(2), i16));
};

TBinaryProtocol.prototype.writeI32 = function(i32) {
  this.tstack.push(binary.writeI32(new Buffer(4), i32));
};

TBinaryProtocol.prototype.writeI64 = function(i64) {
  if (i64.buffer) {
    this.tstack.push(i64.buffer);
  } else {
    this.tstack.push(new Int64(i64).buffer);
  }
};

TBinaryProtocol.prototype.writeDouble = function(dub) {
  this.tstack.push(binary.writeDouble(new Buffer(8), dub));
};

TBinaryProtocol.prototype.writeStringOrBinary = function(name, encoding, arg) {
  if (typeof(arg) === 'string') {
    this.writeI32(Buffer.byteLength(arg, encoding));
    this.tstack.push(new Buffer(arg, encoding));
  } else if ((arg instanceof Buffer) ||
             (Object.prototype.toString.call(arg) == '[object Uint8Array]')) {
    // Buffers in Node.js under Browserify may extend UInt8Array instead of
    // defining a new object. We detect them here so we can write them
    // correctly
    this.writeI32(arg.length);
    this.tstack.push(arg);
  } else {
    throw new Error(name + ' called without a string/Buffer argument: ' + arg);
  }
};

TBinaryProtocol.prototype.writeString = function(arg) {
  this.writeStringOrBinary('writeString', 'utf8', arg);
};

TBinaryProtocol.prototype.writeBinary = function(arg) {
  this.writeStringOrBinary('writeBinary', 'binary', arg);
};

TBinaryProtocol.prototype.readMessageBegin = function() {
  this.inBuf = new Buffer(this.trans.readAll(), 'hex');
  this.rpos = 0;
  var sz = this.readI32().value;
  var type, name, seqid;

  if (sz < 0) {
    var version = sz & VERSION_MASK;
    if (version != VERSION_1) {
      throw new Error("Bad version in readMessageBegin: " + sz);
    }
    type = sz & TYPE_MASK;
    name = this.readString().value;
    seqid = this.readI32().value;
  } else {
    if (this.strictRead) {
      throw new Error("No protocol version header");
    }
    name = this.readString(sz).value;
    type = this.readByte().value;
    seqid = this.readI32().value;
  }
  return {fname: name, mtype: type, rseqid: seqid};
};

TBinaryProtocol.prototype.readMessageEnd = function() {
};

TBinaryProtocol.prototype.readStructBegin = function() {
  return {fname: ''};
};

TBinaryProtocol.prototype.readStructEnd = function() {
};

TBinaryProtocol.prototype.readFieldBegin = function() {
  var type = this.readByte().value;
  if (type == Type.STOP) {
    return {fname: null, ftype: type, fid: 0};
  }
  var id = this.readI16().value;
  return {fname: null, ftype: type, fid: id};
};

TBinaryProtocol.prototype.readFieldEnd = function() {
};

TBinaryProtocol.prototype.readMapBegin = function() {
  var ktype = this.readByte().value;
  var vtype = this.readByte().value;
  var size = this.readI32().value;
  return {ktype: ktype, vtype: vtype, size: size};
};

TBinaryProtocol.prototype.readMapEnd = function() {
};

TBinaryProtocol.prototype.readListBegin = function() {
  var etype = this.readByte().value;
  var size = this.readI32().value;
  return {etype: etype, size: size};
};

TBinaryProtocol.prototype.readListEnd = function() {
};

TBinaryProtocol.prototype.readSetBegin = function() {
  var etype = this.readByte().value;
  var size = this.readI32().value;
  return {etype: etype, size: size};
};

TBinaryProtocol.prototype.readSetEnd = function() {
};

TBinaryProtocol.prototype.readBool = function() {
  var b = this.readByte().value;
  if (b === 0) {
    return { value: false };
  }
  return { value: true };
};

TBinaryProtocol.prototype.readByte = function() {
  return { value: binary.readByte(this.inBuf[this.rpos++]) };
};

TBinaryProtocol.prototype.readI16 = function() {
  var i16 = binary.readI16(this.inBuf, this.rpos);
  this.rpos += 2;
  return { value: i16 };
};

TBinaryProtocol.prototype.readI32 = function() {
  var i32 = binary.readI32(this.inBuf, this.rpos);
  this.rpos += 4;
  return { value: i32 };
};

TBinaryProtocol.prototype.readI64 = function() {
  var buf = new Buffer(8);
  this.inBuf.copy(buf, 0, this.rpos, this.rpos + 8);
  this.rpos += 8;
  // FIXME check whether js is ok
  return { value: new Int64(buf) };
};

TBinaryProtocol.prototype.readDouble = function() {
  var d = binary.readDouble(this.inBuf, this.rpos);
  this.rpos += 8;
  return { value: d };
};

TBinaryProtocol.prototype.readBinary = function() {
  var len = this.readI32();
  if (len === 0) {
    return new Buffer(0);
  }
  if (len < 0) {
    throw new Error("Negative binary size");
  }

  var buf = new Buffer(len);
  this.inBuf.copy(buf, 0, this.rpos, this.rpos + len);
  this.rpos += len;

  return buf;
};

TBinaryProtocol.prototype.readString = function(len) {
  len = len || this.readI32().value;
  if (len === 0) {
    return "";
  }
  if (len < 0) {
    throw new Error("Negative string size");
  }

  var str = this.inBuf.toString('utf8', this.rpos, this.rpos + len);
  this.rpos += len;

  return { value: str };
};

TBinaryProtocol.prototype.getTransport = function() {
  return this.trans;
};

TBinaryProtocol.prototype.skip = function(type) {
  switch (type) {
    case Type.STOP:
      return;
    case Type.BOOL:
      this.readBool();
      break;
    case Type.BYTE:
      this.readByte();
      break;
    case Type.I16:
      this.readI16();
      break;
    case Type.I32:
      this.readI32();
      break;
    case Type.I64:
      this.readI64();
      break;
    case Type.DOUBLE:
      this.readDouble();
      break;
    case Type.STRING:
      this.readString();
      break;
    case Type.STRUCT:
      this.readStructBegin();
      while (true) {
        var r = this.readFieldBegin();
        if (r.ftype === Type.STOP) {
          break;
        }
        this.skip(r.ftype);
        this.readFieldEnd();
      }
      this.readStructEnd();
      break;
    case Type.MAP:
      var mapBegin = this.readMapBegin();
      for (var i = 0; i < mapBegin.size; ++i) {
        this.skip(mapBegin.ktype);
        this.skip(mapBegin.vtype);
      }
      this.readMapEnd();
      break;
    case Type.SET:
      var setBegin = this.readSetBegin();
      for (var i2 = 0; i2 < setBegin.size; ++i2) {
        this.skip(setBegin.etype);
      }
      this.readSetEnd();
      break;
    case Type.LIST:
      var listBegin = this.readListBegin();
      for (var i3 = 0; i3 < listBegin.size; ++i3) {
        this.skip(listBegin.etype);
      }
      this.readListEnd();
      break;
    default:
      throw new  Error("Invalid type: " + type);
  }
};
