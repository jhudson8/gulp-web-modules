// main entry point for your application

// any file in your project can see values in "global"
global.firstName = 'John';

// section exports from other sections can be retrieved asynchronously using the section name
requireSection('foo', function(exports) {
  var message = exports.getMessage();

  // any javascript file within sections/base can be required synchronously just as if it were a node module
  var formatter = require('./message-formatter');

  // the "exports" value is populated using session.exports (see sections/foo/index.js)
  document.getElementById('message').innerText = formatter(message);
});
