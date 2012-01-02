var LoremIpStream = require('../index.js');

var lorem = new LoremIpStream();

lorem.on('end', function() {
  console.log('');
  console.log(this.charSent + ' characters sent');
});

lorem.pipe(process.stdout);