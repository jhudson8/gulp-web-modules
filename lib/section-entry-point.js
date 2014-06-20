var through = require('through2'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    gwmUtil = require('gwm-util')
    File = gutil.File;

module.exports = function(options, test) {
  var firstFile, files = [];

  return through.obj(function(file, enc, cb) {
    if (!firstFile) {
      firstFile = file;
    }
    files.push(file);

    this.push(file);
    cb();
  }, function(cb) {
      var contents;

      if (test) {
        var contents = files.map(function(file) {
          return 'require("./' + file.path.substring(file.base.length) + '");';
        }).join('\n');
      } else {
        contents = options.isBase ? 'require("./index");' : 'var _exports = require("./index") || {}; for (var i in _exports) section.exports[i] = _exports[i];';
      }

      var templatesFile = new File({
        cwd: firstFile.cwd,
        base: firstFile.base,
        path: path.join(firstFile.base, '__entry.js'),
        contents: new Buffer(contents)
      });
      this.push(templatesFile);
    cb();
  });
};
