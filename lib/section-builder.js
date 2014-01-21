var fs = require('fs'),
  wrapper = require('./wrapper'),
  gulp = require('gulp'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  filter = require('gulp-filter'),
  path = require("path"),
  map = require("map-stream"),
  gulpIf = require("gulp-if"),
  ƒ
  watch = require("gulp-watch"),
  header = require("gulp-header"),
  footer = require("gulp-footer"),
  es = require("event-stream");

var fileHeaderPlugin = function (files) {
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

module.exports = function (dirName, dirPath, options) {
  console.log('building module: ' + dirName);

  var fileHeaderPlugin = function (files) {
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

  function applyWrapperContent(pipeline, primarySection) {
    var pipeline = pipeline.pipe(header('\nfunction requireSection (name, callback) { var names = Array.isArray(name) ? name : [name]; for (var i=0; i<names.length; i++) { names[i] = \'sections/\' + names[i]; }\nrequire(names, callback); }\n'));

    if (primarySection) {
      var configFileName = './config/' + buildType + '.json';
      if (fs.existsSync(configFileName)) {
        pipeline = pipeline.pipe(fileHeaderPlugin([configFileName])).pipe(header('self.config = '));
      }
      // pipeline = pipeline.pipe(header(' if (typeof self === \'undefined\') { var self = {}; }\n'));
    } else {
      pipeline = pipeline.pipe(header('define(function() { var section = { exports: {} };\n'));
    }

    if (primarySection) {
      // add all global files in "lib" directory
      if (fs.existsSync('./lib')) {
        pipeline = pipeline.pipe(fileHeaderPlugin(fs.readdirSync('./lib').map(function (part) {
          return './lib/' + part
        })));
      }
    } else {
      pipeline = pipeline.pipe(footer('\nreturn section.exports; });'));
    }
    return pipeline;
  }

  function renameModuleFilesToBuild() {
    function rename(file, callback) {
      var relativePath = path.relative(file.cwd, file.path),
        buildFileName = options.buildPath + '/' + relativePath;
      file.path = path.join(file.cwd, buildFileName);
      var parts = file.path.split('/');
      parts.pop();
      file.base = parts.join('/') + '/';
      callback(null, file);
    }
    return map(rename);
  }

  var primarySection = (dirName === options.primarySection),
    buildType = options.buildType,
    plugins = options.normalizedPlugins;

  var pipeline = gulp.src([dirPath + '/**/*']);
  pipeline = pipeIf(plugins.beforeBrowserify, pipeline, function (pipeline) {
    var outPath = options.buildPath + '/sections/' + dirName;
    pipeline = pipeline.pipe(gulp.dest(outPath));
    return pipeline.pipe(renameModuleFilesToBuild(options));
  });
  pipeline = pipeline.pipe(filter(function (file) {
    return file.path.indexOf(options.entry) >= 0;
  }))
    .pipe(browserify());
  pipeline = pipeIf(plugins.afterBrowserify, pipeline);
  pipeline = applyWrapperContent(pipeline, primarySection);
  pipeline = pipeline.pipe(rename(dirName + '.js'))
  pipeline = pipeIf(plugins.beforeDestination, pipeline);
  pipeline = pipeline.pipe(gulp.dest(options.buildPath + '/sections'));
  pipeIf(plugins.afterDestination, pipeline);
}

function pipeIf(plugin, pipeline, callback) {
  if (!plugin) {
    return pipeline;
  } else {
    pipeline = pipeline.pipe(plugin());
    if (callback) {
      return callback(pipeline);
    } else {
      return pipeline;
    }
  }
}
