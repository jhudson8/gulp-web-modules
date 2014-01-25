//
//  Precompile all handlebars templates matcing the provided file extension (options.ext or "hbs") to
//  the file identified by options.fileName or "templates.js".  A handlebars object must be provided
// as it is not a dependency of this project.
//
var through = require('through2'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    File = gutil.File;

module.exports = function(Handlebars, options) {
  options = options || {};
  var ext = options.ext || 'hbs',
      fileName = options.fileName || 'templates';

  function precompile(file) {
    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError('gulp-web-modules:handlebars', 'Streaming not supported'));
    }

    var filePath = path.relative(file.base, file.path).replace(/\.[^/.]+$/, ""),
        templateContent = Handlebars.precompile(file.contents.toString('utf8')),
        match = filePath.match(/([^\/]*)\/(.+)/);
    if (match && match[1] === fileName) {
      filePath = match[2];
    }
    return ('templates[\'' + filePath + '\'] = Handlebars.template(' + templateContent + ');');
  }

  return {
    javascriptGlob: '**/*.hbs',
    beforeBrowserify: function(options, pipeline) {
      var buffer = [],
          firstFile;

      // return pipeline.pipe(handler);
      // return pipeline.pipe(handler2);
      return pipeline.pipe(through.obj(function(file, enc, cb) {
        if (file.path.indexOf('.' + ext) === -1) {
          // not a template files
          this.push(file);
          return cb();
        }

        if (!firstFile) firstFile = file;
        buffer.push(precompile(file));
        cb();
      },
      function(cb) {
        if (firstFile) {
          var templatesFile = new File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: path.join(firstFile.base, fileName + '.js'),
            contents: new Buffer(prepareTemplate(buffer))
          });
          this.push(templatesFile);
        }
        cb();
      }));
    }
  }
}

function prepareTemplate(buffer) {
  var template = 'var templates = {};\n';
  template += buffer.join('\n');
  template += '\nmodule.exports = templates;\n';
  return template;
}
