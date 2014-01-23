var fs = require('fs'),
  gulp = require('gulp'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  filter = require('gulp-filter'),
  path = require("path"),
  map = require("map-stream"),
  gulpIf = require("gulp-if"),
  watch = require("gulp-watch");

module.exports = function (dirName, dirPath, options) {
  console.log('building module: ' + dirName);

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
  pipeline = pipeline.pipe(require('../plugins/handlebars')('templates.js'));
  pipeline = pipeIf(plugins.beforeBrowserify, pipeline, function (pipeline) {
    var outPath = options.buildPath + '/sections/' + dirName;
    pipeline = pipeline.pipe(gulp.dest(outPath));
    return pipeline.pipe(renameModuleFilesToBuild(options));
  });
  pipeline = pipeline.pipe(filter(function (file) {
    return file.path.indexOf(options.entry) >= 0;
  }))
    .pipe(browserify());
  pipeIf(plugins.afterBrowserify, pipeline);
  var libFiles = fs.readdirSync('./lib').map(function (part) {
          return './lib/' + part
        });

  pipeline = pipeline.pipe(require('./section-content-wrapper')({isPrimary: primarySection, buildType: options.buildType}));
  if (primarySection) {
    pipeline = pipeline.pipe(require('./file-header')(libFiles));
  }
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
