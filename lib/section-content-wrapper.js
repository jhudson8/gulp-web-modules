var fs = require('fs');

module.exports = function(options) {
  var type = options.buildType,
      configFileName = './config/' + type + '.json',
      fileData = {};

  loadFile(configFileName, 'config');
  loadFile(__dirname + '/section-header.hbm', 'header');
  loadFile(__dirname + '/section-footer.hbm', 'footer');

  function isComplete() {
    if (fileData.config && fileData.header && fileData.footer) {
      if (fileData.config === 'error' || fileData.header === 'error' || fileData.footer === 'error') {
        return 'error';
      } else {
        return true;
      }
    }
  }

  function loadFile(filePath, key) {
    fs.exists(filePath, function(exists) {
      if (exists) {
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
          if (err) {
            fileData[key] = 'error';
          } else {
            fileData[key] = data;
          }
          if (isComplete()) {
            fileData._success && fileData._success();
          }
        });
      } else {
        pending = false;
        fileData._success && fileData._success();
      }
    });
  }

  return es.map(function (file, cb) {
    function doit() {
      var status = isComplete();
      if (status === 'error') {
        // FIXME there was a problem
        cb('could not load config file', file);
      } else {
        var handlebars = require('handlebars'),
            header = handlebars.compile(fileData.header),
            footer = handlebars.compile(fileData.footer);
        options.config = fileData.config;
        var headerContent = header(options),
            footerContent = footer(options);

        file.contents = Buffer.concat([new Buffer(headerContent), file.contents, new Buffer(footerContent)]);
        cb(null, file);
      }
    }

    if (!isComplete()) {
      fileData._success = doit;
    } else {
      doit();
    }
  });
};
