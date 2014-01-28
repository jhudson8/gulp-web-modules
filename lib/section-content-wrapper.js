var fs = require('fs'),
    es = require('event-stream'),
    asyncJoin = require('gwm-util').asyncJoin;

module.exports = function(options) {
  var type = options.buildType,
      configFileName = './config/' + type + '.json',
      fileData = {},
      successCallback,
      errorText,
      blocker = asyncJoin(function() {
        successCallback && successCallback();
        successCallback = true;
      });

  function fileCallback(key) {
    return function(err, data) {
      if (err) {
        errorText = err;
      }
      fileData[key] = data;
    }
  };
  function loadFile(filePath, key) {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, {encoding: 'utf-8'}, blocker.newCallback(fileCallback(key)));
    }
  }
  loadFile(configFileName, 'config');
  loadFile(__dirname + '/section-header.hbm', 'header');
  loadFile(__dirname + '/section-footer.hbm', 'footer');
  blocker.complete();


  return es.map(function (file, cb) {

    function onLoadedFiles() {
      if (errorText) {
        cb('could not load file: ' + errorText, file);
      } else {
        options.config = fileData.config;
        var handlebars = require('handlebars'),
            header = handlebars.compile(fileData.header),
            footer = handlebars.compile(fileData.footer)
            headerContent = header(options),
            footerContent = footer(options);

        file.contents = Buffer.concat([new Buffer(headerContent), file.contents, new Buffer(footerContent)]);
        cb(null, file);
      }
    }

    // there will only be a single file in this stream so we're using successCallback as a flag if we've fully loaded
    if (successCallback) {
      onLoadedFiles();
    } else {
      successCallback = onLoadedFiles;
    }
  });
};
