var through = require('through2'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    gwmUtil = require('gwm-util')
    File = gutil.File;

module.exports = function() {
  var firstFile;

  return through.obj(function(file, enc, cb) {
    if (!firstFile) firstFile = file;
    this.push(file);
    cb();
  }, function(cb) {
      var templatesFile = new File({
        cwd: firstFile.cwd,
        base: firstFile.base,
        path: path.join(firstFile.base, 'js/__entry.js'),
        contents: new Buffer('var _exports = require("./index") || {}; for (var i in _exports) section.exports[i] = _exports[i];')
      });
      this.push(templatesFile);
    cb();
  });
};
