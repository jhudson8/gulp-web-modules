module.exports = function(name, options) {
  options = options || {};
  var es = require('event-stream');

  return es.map(function(file, callback) {
      var prefix = '',
          suffix = '';
      if (options.addDefines) {
          prefix += 'define(function() { ';
      }
      prefix += 'function requireModule (name, callback) { var names = _.isArray(name) ? name : [name]; for (var i=0; i<names.length; i++) { names[i] = \'modules/\' + names[i]; } ';
      if (options.includeStyleSheet) {
          prefix += '$(\'head\').append(\'<link rel="stylesheet" type="text/css" href="modules/' + name + '.css">\'); ';
      }
      prefix += ' require(names, callback); }\n';
      if (options.addDefines) {
          prefix += ' var moduleExports = {moduleName: \'' + name + '\'}; \n\n';
      }
      if (options.addDefines) {
          suffix += '\n\nreturn moduleExports; });';
      }
      file.contents = new Buffer(prefix + file.contents + suffix);
      callback(null, file);
  });
}
