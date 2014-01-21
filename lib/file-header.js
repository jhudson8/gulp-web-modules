var fs = require('fs');

// prepend the contents of all files to the file
module.exports = function (files) {
  return es.map(function (file, cb) {
    var fileContents = [];

    function callback(index) {
      return function (err, data) {
        if (err) {
          console.err(err);
        } else if (data) {
          fileContents.push(data);
        }

        index++;
        var path = files[index];
        if (path) {
          fs.readFile(path, callback(index));
        } else {
          fileContents.push(file.contents);
          file.contents = Buffer.concat(fileContents);
          cb(null, file);
        }
      }
    }
    callback(-1)();
  });
};
