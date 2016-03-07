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
