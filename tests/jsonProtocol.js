var assert = require('assert');
var TJSONProtocol = require('../lib/jsonProtocol');
var constant = require('../lib/constant');

describe('TJSONProtocol', function () {
  it('should serialize string', function () {
    var transport = {
      buf: [],
      write: function (wbuf) {
        this.buf.push(wbuf);
      }
    };
    var protocol = new TJSONProtocol(transport);
    protocol.writeMessageBegin('message', constant.MessageType.CALL, 0);
    protocol.writeStructBegin('struct');
    protocol.writeFieldBegin('field', constant.Type.STRING, 1);
    protocol.writeString('success');
    protocol.writeFieldEnd();
    protocol.writeStructEnd();
    protocol.writeMessageEnd();
    assert.equal(transport.buf.length, 1);
    assert.deepEqual(transport.buf[0], '[1,"message",1,0,{"1":{"str":"success"}}]');
  });

  it('should deserialize string', function () {
    var transport = {
      readAll: function () {
        return '[1,"message",1,0,{"1":{"str":"success"}}]';
      }
    };
    var protocol = new TJSONProtocol(transport);

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

  it('should serialize boolean', function () {
    var transport = {
      buf: [],
      write: function (wbuf) {
        this.buf.push(wbuf);
      }
    };
    var protocol = new TJSONProtocol(transport);
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
    assert.equal(transport.buf.length, 1);
    console.log(transport.buf);
    assert.deepEqual(transport.buf[0], '[1,"message",1,0,{"1":{"tf":1},"2":{"tf":0}}]');
  });

  it('should deserialize boolean', function () {
    var transport = {
      readAll: function () {
        return '[1,"message",1,0,{"1":{"tf":1},"2":{"tf":0}}]';
      }
    };
    var protocol = new TJSONProtocol(transport);

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
