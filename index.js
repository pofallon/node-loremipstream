var Stream = require('stream').Stream;
var util = require('util');

util.inherits(LoremIpStream, Stream);

function LoremIpStream(options) {

  var that = this;

  Stream.call(this);

  if (!options) {
    options = {};
  }

  this.readable = true;
  this.writable = false;
  
  this.streamEncoding = null;
  this.sent = 0;
  this.position = 0;  
  this.intervalId = null;

  // The total length of the stream
  this.size = options.size || lorem.length * 10;

  // The length of each data emission
  this.dataSize = options.dataSize || lorem.length;

  // The time to wait between each data emission
  this.dataInterval = options.dataInterval || 100;

  //TODO:  Add more options?

  process.nextTick(function() {
    that.resume();
  });

}

LoremIpStream.prototype.setEncoding = function(encoding) {

  if (encoding.match(/^utf8|ascii|base64$/)) {
    this.streamEncoding = encoding;
  } else {
    this.emit('error', new Error('Invalid string encoding'));
  }

};

LoremIpStream.prototype.pause = function() {

  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  
};

LoremIpStream.prototype.resume = function() {

  var that = this;

  if (!this.intervalId) {

    this.intervalId = setInterval(function() {

      if (that.sent >= that.size) {
        
        that.emit('end');
        that.destroy();
      
      } else {

        var remaining = that.size - that.sent;

        var bufferSize = (remaining > that.dataSize) ? that.dataSize : remaining;
        
        var theBuffer = new Buffer(bufferSize);

        for (var i=0; i<bufferSize; i++) {
          theBuffer[i] = that._getNextChar();
        }

        if (that.streamEncoding) {
          that.emit('data', theBuffer.toString(that.streamEncoding));
        } else {
          that.emit('data',theBuffer);
        }

        that.sent += bufferSize;

      }
    
    }, this.dataInterval);

  }

};

LoremIpStream.prototype.destroy = function() {
  
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

};

LoremIpStream.prototype.destroySoon = function() {
  
  this.destroy();

};

LoremIpStream.prototype._getNextChar = function() {

  if (this.position > lorem.length) {
    this.position = 0;
  }
  
  return(lorem.charCodeAt(this.position++));  

}

var lorem  = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ';
    lorem += 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ';
    lorem += 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ';
    lorem += 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';

LoremIpStream.LoremIpsum = lorem;

module.exports = LoremIpStream;