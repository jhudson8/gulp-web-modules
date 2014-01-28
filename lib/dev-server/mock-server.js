module.exports = function (options) {
  options = options || {};
  options.base = options.base || './dev/mocks/';

  function getFileNameChoices(req, path, callback) {
    var choices = [],
      parts = path.split('/'),
      method = req.method;

    for (var i = parts.length; i > 0; i--) {
      var subParts = parts.slice(0, i),
        path = options.base + subParts.join('/'),
        fullPath = (method === 'GET') ? (path + '.json') : (path + '_' + method + '.json');
      choices.push(fullPath);
    }

    callback({
      fileName: choices
    });
  }

  var config = {
    filePathLocation: options.base,
    urlPrefix: options.prefix,
    enabled: true
  };

  return {
    userConfig: {
      key: 'mock-server',
      section: 'Dev Server',
      inputs: [
        {key: 'filePathLocation', label: 'Directory to serve files from'},
        {key: 'urlPrefix', label: 'URL Prefix (to enable mock response)'},
        {key: 'enabled', label: 'Mock Server Enabled', type: 'boolean'},
      ],
      store: config
    },

    onRequest: function (requestOptions, pluginOptions, callback) {
      if (options.prefix && config.enabled) {
        var uri = requestOptions.uri
        if (uri.indexOf(options.prefix) === 0) {
          path = uri.substring(options.prefix.length);
          if (path.indexOf('/') === 0) {
            // remove the initial slash
            path = path.substring(1);
          }
          return getFileNameChoices(requestOptions.req, path, callback);
        }
      }
      callback();
    }
  }
}
