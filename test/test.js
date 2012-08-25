/*!
 * node-loremipstream
 * Copyright(c) 2012 Paul O'Fallon <paul@ofallonfamily.com>
 * MIT Licensed
 */

var LoremIpStream = require('../index.js');
var MemoryStream = require('memorystream');
var should = require('should');

describe('LoremIpStream', function() {

  var lorem;
  var memory;

  beforeEach(function() {
    lorem = new LoremIpStream({dataInterval:2});
    memory = new MemoryStream(null,{readable : false});
  });

  afterEach(function() {
    lorem.destroy();
  });

  describe('a stream', function() {

    var dataWritten = false;

    it('should be readable', function() {
      lorem.readable.should.be.true;
    });

    it('should not be writable', function() {
      lorem.writable.should.be.false;
    })

    it('should emit a data event', function(done) {
      lorem.on('data', function(data) {
        data.should.exist;
        data.should.not.be.empty;
        dataWritten = true;
      });
      lorem.on('end', function() {
        dataWritten.should.be.true;
        done();
      })
      lorem.pipe(memory);
    });

    it('should emit an end event', function(done) {
      lorem.on('end', function() { 
        done(); 
      });
      lorem.pipe(memory);
    });

    it('should support pause and resume', function(done) {
      var dataCount = 0;
      var paused = false;
      var lorem = new LoremIpStream({dataInterval:2});
      lorem.on('data', function(data) {
        paused.should.be.false;
        dataCount++;
        if (dataCount === 1) {
          paused = true;
          lorem.pause();
          setTimeout(function() {
            paused = false;
            lorem.resume();
          },lorem.dataInterval*3);
        }
      });
      lorem.on('end', function() {
        done();
      })
    });

    it('should generate a stream of 10 Lorem Ipsums by default', function(done) {
      lorem.on('end', function() {
        var testString = '';
        for(var i=0; i<10; i++) {
          testString += LoremIpStream.LoremIpsum;
        };
        memory.getAll().should.equal.testString;
        done();
      });
      lorem.pipe(memory);
    });

    it('should interpret a single option as a size', function(done) {
      lorem = new LoremIpStream(LoremIpStream.LoremIpsum.length);
      lorem.on('end', function() {
        memory.getAll().should.equal(LoremIpStream.LoremIpsum);
        done();
      });
      lorem.pipe(memory);
    });

    it('should generate a shorter stream with option.size', function(done) {
      lorem = new LoremIpStream({size : LoremIpStream.LoremIpsum.length*2, dataInterval: 2});
      lorem.on('end', function() {
        var testString = '';
        for(var i=0; i<2; i++) {
          testString += LoremIpStream.LoremIpsum;
        };
        memory.getAll().should.equal.testString;
        done();
      });
      lorem.pipe(memory);
    });

    it('should generate a longer stream with option.size', function(done) {
      lorem = new LoremIpStream({size : LoremIpStream.LoremIpsum.length*11, dataInterval: 2});
      lorem.on('end', function() {
        var testString = '';
        for(var i=0; i<11; i++) {
          testString += LoremIpStream.LoremIpsum;
        };
        memory.getAll().should.equal.testString;
        done();
      });
      lorem.pipe(memory);
    });

    it('should generate a stream with an option.size less than one Lorem Ipsum', function(done) {
      lorem = new LoremIpStream({size : 10, dataInterval: 2});
      var dataCount = 0;
      lorem.on('data', function(data) {
        dataCount++;
        data.length.should.equal(10);
      });
      lorem.on('end', function() {
        memory.getAll().should.equal(LoremIpStream.LoremIpsum.substr(0,10));
        dataCount.should.equal(1);
        done();
      });
      lorem.pipe(memory);
    });

    it('should generate a stream with an option.size not a multiple of Lorem Ipsum', function(done) {
      lorem = new LoremIpStream({size : (LoremIpStream.LoremIpsum.length*5)+12, dataInterval: 2});
      var dataCount = 0;
      lorem.on('data', function(data) {
        dataCount++;
        if (dataCount < 6) {
          data.length.should.equal(LoremIpStream.LoremIpsum.length);
        } else {
          data.length.should.equal(12);
        }
      });
      lorem.on('end', function() {
        var testString;
        for(var i=0; i<5; i++) {
          testString += LoremIpStream.LoremIpsum;
        }
        testString += LoremIpStream.LoremIpsum.substr(0,12);
        memory.getAll().should.equal.testString;
        dataCount.should.equal(6);
        done();
      });
      lorem.pipe(memory);
    });

    it('should emit data events with smaller payloads with a smaller option.dataSize', function(done) {
      lorem = new LoremIpStream({size : LoremIpStream.LoremIpsum.length, dataSize : 20, dataInterval : 2});
      var dataCount = 0;
      lorem.on('data', function(data) {
        dataCount++;
        data.length.should.be.within(1,20);
      });
      lorem.on('end', function() {
        memory.getAll().should.equal(LoremIpStream.LoremIpsum);
        dataCount.should.equal(Math.ceil(LoremIpStream.LoremIpsum.length/20));
        done();
      });
      lorem.pipe(memory);
    });

    it('should track the number of characters sent', function(done) {
      lorem.on('end', function() {
        lorem.sent.should.equal((LoremIpStream.LoremIpsum.length)*10);
        done();
      });
    })

  });

});
