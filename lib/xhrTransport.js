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
