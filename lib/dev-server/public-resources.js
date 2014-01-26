var path = require('path');

module.exports = {
  onRequest: function (requestOptions, pluginOptions, callback) {
    var uri = requestOptions.uri;
    if (uri === '/') {
      uri = pluginOptions.defaultServResource;
    }
    callback({
      fileName: path.join(pluginOptions.base, uri)
    })
  }
};
