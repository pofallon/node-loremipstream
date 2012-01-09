# node-loremipstream
A configurable [Readable Stream](http://nodejs.org/docs/latest/api/streams.html#readable_Stream) that generates [Lorem ipsum](http://www.wikipedia.org/wiki/Lorem_ipsum). Useful for stream testing.

[![Build Status](https://secure.travis-ci.org/pofallon/node-loremipstream.png)](http://travis-ci.org/pofallon/node-loremipstream)

## Usage

```javascript
var LoremIpStream = require('loremipstream');

var lorem = new LoremIpStream(options);

lorem.on('end', function() {
  console.log(this.sent + ' characters sent');
});

lorem.pipe(process.stdout);
```

where the following options are supported:

* size - the total size (in characters) of the stream
* dataSize - the size (in characters) of each emitted 'data' event
* dataInterval - how often (in ms) to emit each 'data' event

## Install

<pre>
  npm install loremipstream
</pre>

## Dependencies

This library has no production dependencies, only the following test dependencies:

* [visionmedia/mocha](/visionmedia/mocha)
* [visionmedia/should.js](/visionmedia/should.js)
* [JSBizon/memorystream](/JSBizon/memorystream)
