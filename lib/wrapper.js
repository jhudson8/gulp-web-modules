module.exports = function (name, options) {
  options = options || {};
  var es = require('event-stream');

  return es.map(function (file, callback) {
    file.contents = new Buffer((options.header || '') + file.contents + (options.footer || ''));
    callback(null, file);
  });
}
