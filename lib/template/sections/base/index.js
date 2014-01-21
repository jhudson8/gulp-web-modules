// main entry point for your application

// any file in your project can see values in "global"
global.foo = 'bar';

// any javascript file within sections/base can be required synchronously just as if it were a node module
var retriever = require('./message-retriever'),
    message = retriever.getMessage();

// section exports from other sections can be retrieved asynchronously using the section name
requireSection('foo', function(exports) {
  // the "exports" value is populated using session.exports (see sections/foo/index.js)
  document.getElementById('message').innerText = exports.formatMessage(message);
});
