var through = require('through2');

module.exports = function(callback) {
  return through.obj(function(file, enc, cb) {
    this.push(file);
    cb();
  }, function(cb) {
    callback();
    cb();
  });
}