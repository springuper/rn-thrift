var assert = require('assert');
var TBinaryProtocol = require('../lib/binaryProtocol');
var constant = require('../lib/constant');

describe('TBinaryProtocol', function () {
  it('should serialize/deserialize string', function () {
    var transport = {
      write: function (wbuf) {
        this.wbuf = wbuf;
      },
      readAll: function () {
        return this.wbuf;
      }
    };
    var protocol = new TBinaryProtocol(transport);
    protocol.writeMessageBegin('message', constant.MessageType.CALL, 0);
    protocol.writeStructBegin('struct');
    protocol.writeFieldBegin('field', constant.Type.STRING, 1);
    protocol.writeString('success');
    protocol.writeFieldEnd();
    protocol.writeStructEnd();
    protocol.writeMessageEnd();

    var ret = protocol.readMessageBegin();
    assert.equal(ret.fname, 'message');
    assert.equal(ret.mtype, constant.MessageType.CALL);
    assert.equal(ret.rseqid, 0);

    protocol.readStructBegin();
    ret = protocol.readFieldBegin();
    assert.equal(ret.ftype, constant.Type.STRING);
    assert.equal(ret.fid, 1);

    ret = protocol.readString();
    assert.equal(ret.value, 'success');

    protocol.readFieldEnd();
    protocol.readStructEnd();
    protocol.readMessageEnd();
  });

  it('should serialize/deserialize boolean', function () {
    var transport = {
      write: function (wbuf) {
        this.wbuf = wbuf;
      },
      readAll: function () {
        return this.wbuf;
      }
    };
    var protocol = new TBinaryProtocol(transport);
    protocol.writeMessageBegin('message', constant.MessageType.CALL, 0);
    protocol.writeStructBegin('struct');
    protocol.writeFieldBegin('field', constant.Type.BOOL, 1);
    protocol.writeBool(true);
    protocol.writeFieldEnd();
    protocol.writeFieldBegin('field2', constant.Type.BOOL, 2);
    protocol.writeBool(false);
    protocol.writeFieldEnd();
    protocol.writeStructEnd();
    protocol.writeMessageEnd();

    var ret = protocol.readMessageBegin();
    assert.equal(ret.fname, 'message');
    assert.equal(ret.mtype, constant.MessageType.CALL);
    assert.equal(ret.rseqid, 0);

    protocol.readStructBegin();
    ret = protocol.readFieldBegin();
    assert.equal(ret.ftype, constant.Type.BOOL);
    assert.equal(ret.fid, 1);

    ret = protocol.readBool();
    assert.equal(ret.value, true);

    protocol.readFieldEnd();
    ret = protocol.readFieldBegin();
    assert.equal(ret.ftype, constant.Type.BOOL);
    assert.equal(ret.fid, 2);

    ret = protocol.readBool();
    assert.equal(ret.value, false);

    protocol.readFieldEnd();
    protocol.readStructEnd();
    protocol.readMessageEnd();
  });
});
