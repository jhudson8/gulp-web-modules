var through = require('through2');

module.exports = function(callback, fileCallback) {
  return through.obj(function(file, enc, cb) {
    this.push(file);
    fileCallback && fileCallback(file);
    cb();
  }, function(cb) {
    callback && callback();
    cb();
  });
}