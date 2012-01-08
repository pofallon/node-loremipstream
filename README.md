# node-loremipstream
A configurable Readable Stream that generates Lorem ipsum. Helpful in stream testing.

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
* dataInterval - how often to emit each 'data' event (in ms)

## Install

<pre>
  npm install loremipstream
</pre>

## Dependencies

This library has no production dependencies, only the following test dependencies:

* [visionmedia/mocha](/visionmedia/mocha)
* [visionmedia/should.js](/visionmedia/should.js)
* [JSBizon/memorystream](/JSBizon/memorystream)
