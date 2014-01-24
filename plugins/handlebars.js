//
//  Precompile all handlebars templates matcing the provided file extension (options.ext or "hbs") to
//  the file identified by options.fileName or "templates.js"
//
var through = require('through2'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    File = gutil.File,
    handlebars = require('handlebars');

module.exports = function(options) {
  options = options || {};
  var ext = options.ext || 'hbs',
      fileName = options.fileName || 'templates.js';

  function precompile(file) {
    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError('gulp-web-modules:handlebars', 'Streaming not supported'));
    }

    var filePath = path.relative(file.base, file.path).replace(/\.[^/.]+$/, ""),
        templateContent = handlebars.precompile(file.contents.toString('utf8'));
    return ('templates[\'' + filePath + '\'] = Handlebars.template(' + templateContent + ');');
  }

  var buffer = [],
      firstFile;

  var handler = through.obj(function(file, enc, callback) {
      var extLength = ext.length,
          extIndex = file.path.indexOf('.' + ext);

      if (extIndex === -1) {
        // not a template files
        this.push(file);
        return callback();
      }

      if (!firstFile) firstFile = file;
      buffer.push(precompile(file));
      callback();
    },

    function(callback) {
      if (firstFile) {
        var templatesFile = new File({
          cwd: firstFile.cwd,
          base: firstFile.base,
          path: path.join(firstFile.base, fileName),
          contents: new Buffer(prepareTemplate(buffer))
        });
        this.push(templatesFile);
      }
      callback();
    }
  );

  return {
    javascriptGlob: '**/*.hbs',
    beforeBrowserify: function(options, pipeline) {
      return pipeline.pipe(handler);
    }
  }
}

function prepareTemplate(buffer) {
  var template = 'var templates = {};\n';
  template += buffer.join('\n');
  template += '\nmodule.exports = templates;\n';
  return template;
}
