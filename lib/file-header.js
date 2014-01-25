//
//  inject the contents of files matching the provided file names to the head of the files that pass through
//
var es = require('event-stream'),
    fs = require('fs'),
    join = require('./async-join');    

module.exports = function(fileNames) {
  var successCallback,
      error,
      blocker = join(function() {
        successCallback && successCallback();
        successCallback = true;
      }),
      buffer = [];
  for (var i in fileNames) {
    fs.readFile(fileNames[i], blocker.newCallback(function(err, data) {
      if (err) {
        error = err;
      }
      buffer.push(new Buffer(data));
    }));
  }
  blocker.complete();

  return es.map(function(file, cb) {
    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError('gulp-web-modules:file-header', 'Streaming not supported'));
    }

    var onLoad = function() {
      var clone = buffer.slice(0);
      clone.push(file.contents);
      file.contents = Buffer.concat(clone);
      cb(error, file);
    }

    if (successCallback) {
      onLoad();
    } else {
      successCallback = onLoad;
    }
  });
}
