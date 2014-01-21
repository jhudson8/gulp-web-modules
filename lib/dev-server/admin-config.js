var server;

function gatherInputConfig(plugins) {
  var rtn = [];
  for (var i=0; i<plugins.length; i++) {
    var plugin = plugins[i];
    if (plugin.userConfig) {
      rtn.push(plugin.userConfig);
    }
  }
  return rtn;
}

function generateUserConfigInputHTML(userConfig) {
  var html = '<section><legend>' + userConfig.section + '</legend>';
  html += (userConfig.inputs || []).map(function(entry) {
      var inputId = userConfig.key + '!' + entry.key;
          type = entry.type || 'string',
          idName = 'id="' + inputId + '" name="' + inputId + '"',
          value = userConfig.store[entry.key],
          subhtml = '<div class="form-field">';

      subhtml += ('<label for="' + inputId + '">' + entry.label + '</label>');
      if (type === 'boolean') {
        subhtml += ('<input type="checkbox" value="t" ' + idName);
        if (value) {
          subhtml += ' checked';
        }
        subhtml += '/>';
      } else {
        subhtml += ('<input type="text" value="' + escape(value || '') + '" ' + idName + '/>');
      }
      subhtml += '</div>';
      return subhtml;
  }).join('');
  html += '</section>';
  return html;
}

function showConfig(requestOptions, pluginOptions, callback) {
  var configs = [],
      plugins = server.getPlugins(),
      userConfigEntries = gatherInputConfig(plugins);

  var html = '<html><head><style type="text/css">';
  html += '.form-field {padding-bottom: 1em;} legend {font-weight: 1.2em; border-bottom: solid 1px #ccc; text-transform: uppercase; margin-bottom: .3em} .form-field label {display: block}';
  html += '</style></head><body><form action="/$admin/update">';
  html += userConfigEntries.map(generateUserConfigInputHTML).join('');
  html += '<input type="submit" value="Save"/>';
  html += '</form></body></html>';
  var res = requestOptions.res;
  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(html);
  res.end();
  callback(true);
}

function doUpdate(requestOptions, pluginOptions, callback) {
  var res = requestOptions.res,
      req = requestOptions.req,
      url = require('url'),
      url_parts = url.parse(req.url, true),
      query = url_parts.query;

  var indexedPlugins = {}
      userConfigEntries = gatherInputConfig(server.getPlugins());
  for (var i in userConfigEntries) {
    var userConfigEntry = userConfigEntries[i];
    for (var j in userConfigEntry.inputs) {
      var entry = userConfigEntry.inputs[j],
          key = userConfigEntry.key + '!' + entry.key,
          value = query[key],
          type = entry.type || 'string',
          store = userConfigEntry.store;
      if (type === 'boolean') {
        store[entry.key] = !!value;
      } else {
        store[entry.key] = value;
      }
    }
  }

  res.writeHead(302, {
    'Location': '/$admin?success=true'
  });
  res.end();
  callback(true);
}

module.exports = {
  onRequest: function (requestOptions, pluginOptions, callback) {
    var uri = requestOptions.uri;
    if (uri.indexOf('/$admin') === 0) {
      if (uri === '/$admin/update') {
        doUpdate(requestOptions, pluginOptions, callback);
      } else {
        showConfig(requestOptions, pluginOptions, callback);
      }
    } else {
      callback();
    }
  },
  setServer: function(_server) {
    server = _server;
  }
}
