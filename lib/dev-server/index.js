var http = require('http'),
  url = require('url'),
  path = require('path'),
  fs = require('fs');
var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};

function respondWithFile(res, req, fileName) {
  var fileNames = Array.isArray(fileName) ? fileName : [fileName];

  for (var i in fileNames) {
    fileName = fileNames[i];

    if (fs.existsSync(fileName)) {
      var mimeType = mimeTypes[path.extname(fileName).split(".")[1]];
      res.writeHead(200, mimeType);

      var readStream = fs.createReadStream(fileName);
      readStream.pipe(res);
      return true;

    }
  }
  return false;
}

module.exports = function (options) {

  var plugins = [];

  function addPlugin(plugin) {
      plugins.push(plugin);
      if (plugin.setServer) {
        plugin.setServer(this);
      }
  }

  function startServer() {
    http.createServer(function (req, res) {
      var uri = url.parse(req.url).pathname,
        requestOptions = {
          req: req,
          res: res,
          uri: uri,
          base: './' + options.buildPath
        };

      // iterate through all available plugins to handle the request
      var callback = function (i) {
        function next() {
          i++;
          var nextPlugin = plugins[i];
          if (nextPlugin) {
            var nextCallback = callback(i);
            nextPlugin.onRequest(requestOptions, options, nextCallback);
          } else {
            // no plugin has responded
            res.writeHead(404, {
              'Content-Type': 'text/plain'
            });
            res.write('No plugins handled "' + uri + '"');
            res.end();
            console.log('request not handled: ' + uri);
          }
        }

        return function (response) {
          if (!response) {
            return next();
          }
          else if (response === true) {
            return;
          }
          else if (response.fileName) {
            if (!respondWithFile(res, req, response.fileName)) {
              return next();
            }
          } else if (response.text || response.stream) {
            var mimeType = response.mimeType || 'text/plain';
            res.writeHead(200, mimeType);

            if (response.stream) {
              res.pipe(response.stream);
            } else {
              res.write(response.text);
            }
            
            res.end();
          }
        }
      }

      // initiate the plugin chain
      callback(-1)();

    }).listen(options.port);
  }

  var rtn = {
    start: startServer,

    addPlugin: addPlugin,

    getPlugins: function() {
      return plugins;
    }
  }

  var _plugins = options.plugins;
  if (_plugins) {
    for (var i=0; i<_plugins.length; i++) {
      rtn.addPlugin(_plugins[i]);
    }
  }
  return rtn;
};
