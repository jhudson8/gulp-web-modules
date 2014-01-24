var fs = require('fs'),
  gulp = require('gulp'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  gutil = require('gulp-util'),
  filter = require('gulp-filter'),
  path = require("path"),
  map = require("map-stream"),
  gulpIf = require("gulp-if"),
  join = require('./async-join'),
  util = require('./util');

module.exports = function(options, callback) {
  var plugins = options.plugins;

  return function() {
    gutil.log('gulp-web-modules:section-builder: building section: \'' + options.section + '\'');

    var blocker = require('./async-join')(callback);
    handleJavascriptFiles(blocker.newCallback());
    handleCSSFiles(blocker.newCallback());
    handleAdditional(blocker.newCallback())
    blocker.complete();
  }

  function renameToTempDir() {
    return map(function(file, callback) {
      var tmpPathBase = path.join(file.cwd, options.tmpPath);
      file.base = tmpPathBase;
      file.path = file.base + path.basename(file.path);
      callback(null, file);
    });
  }

  function handleAdditional(callback) {
    // FIXME add additional section builders
  }

  function handleJavascriptFiles(callback) {
    var sectionBuildPlugins = util.pluginGroupGlobs('javascriptGlob', options);
    sectionBuildPlugins.push(options.srcPath + '**/*.js');
    var pipeline = util.src(sectionBuildPlugins, options);

    pipeline = util.pipeIf('beforeBrowserify', pipeline, options, function (pipeline) {
      // browserify needs all files to be on disk
      pipeline = pipeline.pipe(gulp.dest(options.tmpPath));
      pipeline = pipeline.pipe(renameToTempDir());
      return pipeline;
    });

    var fileName = options.section + '/' + options.entry;
    pipeline = pipeline.pipe(filter(function(file) {
      return (file.path.indexOf(fileName) >= 0);
    }));

    pipeline = pipeline.pipe(browserify());
    pipeline = pipeline.pipe(rename(options.section + '.js'));
    pipeline = util.pipeIf('afterBrowserify', pipeline, options);

    pipeline = pipeline.pipe(require('./section-content-wrapper')(options));
    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    pipeline = util.pipeIf('javascriptComplete', pipeline, options);
    pipeline.pipe(require('./callback')(callback));
  }

  function handleCSSFiles(callback) {
    var sectionBuildPlugins = util.pluginGroupGlobs('cssGlob', options);
    sectionBuildPlugins.push(options.srcPath + '**/*.css');
    var pipeline = util.src(sectionBuildPlugins, options);

    pipeline = util.pipeIf('beforeCSSConcat', pipeline, options);
    pipeline = pipeline.pipe(require('./css-concat')());
    pipeline = util.pipeIf('afterCSSConcat', pipeline, options);
    pipeline = pipeline.pipe(rename(options.section + '.css'))
    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    pipeline = util.pipeIf('cssComplete', pipeline, options);
    pipeline.pipe(require('./callback')(callback));
  }
};
