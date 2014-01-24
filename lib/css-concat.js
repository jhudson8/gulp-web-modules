//
//  Merge all css documents found into a single root level document called style.
//
var through = require('through2'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    File = gutil.File,
    handlebars = require('handlebars');

module.exports = function(options) {
  options = options || {};
      fileName = options.fileName || 'style.css';

  var buffer = [],
      firstFile;

  return through.obj(function(file, enc, callback) {
      var extIndex = file.path.indexOf('.css');

      if (extIndex === -1) {
        // not a stylesheet
        this.push(file);
        return callback();
      }

      if (!firstFile) firstFile = file;
      buffer.push(file.contents);
      callback();
    },

    function(callback) {
      if (firstFile) {
        var templatesFile = new File({
          cwd: firstFile.cwd,
          base: firstFile.base,
          path: path.join(firstFile.base, fileName),
          contents: Buffer.concat(buffer)
        });
        this.push(templatesFile);
      }
      callback();
    }
  );
}
