//
//  inject the contents of files matching the provided file names to the head of the files that pass through
//
var es = require('event-stream'),
    fs = require('fs'),
    join = require('./async-join');    

module.exports = function(fileNames) {
  var successCallback,
      error,
      loaded,
      blocker = join(function() {
        successCallback && successCallback();
        loaded = true;
      }),
      buffer = [];

  function readFile(fileName) {
    fs.readFile(fileNames[i], blocker.newCallback(function(err, data) {
      if (err) {
        error = err;
      }
      buffer.push({name: fileName, data: new Buffer(data)});
    }));
  }

  for (var i in fileNames) {
    readFile(fileNames[i]);
  }
  blocker.complete();

  return es.map(function(file, cb) {
    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError('gulp-web-modules:file-header', 'Streaming not supported'));
    }

    var onLoad = function() {
      var index = {};
      // index the entries
      for (var i in buffer) {
        var entry = buffer[i];
        index[entry.name] = entry.data;
      }

      var ordered = [];
      // order the entries to match the incoming array of file names
      for (var i in fileNames) {
        var fileName = fileNames[i];
        if (index[fileName] && index[fileName]) {
          ordered.push(new Buffer(index[fileName]));
        }
      }
      ordered.push(file.contents);

      file.contents = Buffer.concat(ordered);
      cb(error, file);
    }

    if (loaded) {
      onLoad();
    } else {
      successCallback = onLoad;
    }
  });
}
