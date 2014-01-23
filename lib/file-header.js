//
//  inject the contents of files matching the provided file names to the head of the files that pass through
//
var through = require('through2'),
    fs = require('fs'),
    gutil = require('gulp-util');

module.exports = function(fileNames) {

  return through.obj(function(file, enc, callback) {
    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError('gulp-web-modules:file-header', 'Streaming not supported'));
    }

    var self = this,
        buffer = [];

    function onFileLoad(index, path) {
      return function(err, data) {
        if (err) {
          return self.emit('error', new gutil.PluginError('gulp-web-modules:file-header', path + ' could not be loaded'));
        }

        buffer.push(data);

        index++;
        var path = fileNames[index];
        if (path) {
          // still more to load
          fs.readFile(path, onFileLoad(index, path));
        } else {
          // we're done
          buffer.push(file.contents);
          file.contents = Buffer.concat(buffer);
          self.push(file);
          callback();
        }
      }
    }

    var index = 0,
        path = fileNames[index];
    if (path) {
      fs.readFile(path, onFileLoad(index, path));
    } else {
      self.push(file);
      callback();
    }

  });
}
