var fs = require('fs'),
  gulp = require('gulp'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  gutil = require('gulp-util'),
  filter = require('gulp-filter'),
  path = require("path"),
  map = require("map-stream"),
  gulpIf = require("gulp-if"),
  watch = require("gulp-watch"),
  join = require('./async-join');

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


  function pipeIf(name, pipeline, callback) {
    var plugins = pluginGroup(name),
        basePlugins = pluginGroup(name + 'Base');
    if (plugins.length === 0 && basePlugins.length === 0) {
      return pipeline;
    } else {
      for (var i in plugins) {
        pipeline = plugins[i](options, pipeline);
      }
      for (var i in basePlugins) {
        pipeline = basePlugins[i](options, pipeline);
      }

      return callback && callback(pipeline) || pipeline;
    }
  }

  function pluginGroup(name) {
    var rtn = [];
    for (var i in plugins) {
      var plugin = plugins[i];
      if (plugin[name]) {
        rtn.push(plugin[name]);
      }
    }
    return rtn;
  }

  function pluginGroupGlobs(name) {
    var globList = pluginGroup(name),
        normalized = [];
    for (var i in globList) {
      var entry = globList[i];
      if (Array.isArray(entry)) {
        normalized.push.apply(normalized, entry);
      } else {
        normalized.push(entry);
      }
    }
    for (var i in normalized) {
      normalized[i] = options.srcPath + normalized[i];
    }
    return normalized;
  }

  function renameToTempDir() {
    return map(function(file, callback) {
      var tmpPath = options.tmpPath + path.relative(file.cwd, file.path);

      file.path = path.join(file.cwd, tmpPath);
      var parts = file.path.split('/');
      // FIXME need to adjust this
      parts.pop();
      file.base = parts.join('/') + '/';
      callback(null, file);
    });
  }

  function handleAdditional(callback) {
    // FIXME add additional section builders
  }

  function handleJavascriptFiles(callback) {
    var sectionBuildPlugins = pluginGroupGlobs('javascriptGlob');
    sectionBuildPlugins.push(options.srcPath + '**/*.js');
    var pipeline = gulp.src(sectionBuildPlugins);

    pipeline = pipeIf('beforeBrowserifyFoo', pipeline, function (pipeline) {
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
    pipeline = pipeIf('afterBrowserify', pipeline);
    pipeline = pipeline.pipe(require('./section-content-wrapper')(options));
    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    pipeline = pipeIf('javascriptComplete', pipeline);
    pipeline.pipe(require('./callback')(callback));
  }

  function handleCSSFiles(callback) {
    var sectionBuildPlugins = pluginGroupGlobs('cssGlob');
    sectionBuildPlugins.push(options.srcPath + '**/*.css');
    var pipeline = gulp.src(sectionBuildPlugins);
    pipeline = pipeIf('beforeCSSConcat', pipeline);
    pipeline = pipeline.pipe(require('./css-concat')());
    pipeline = pipeIf('afterCSSConcat', pipeline);
    pipeline = pipeline.pipe(rename(options.section + '.css'))
    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    pipeline = pipeIf('cssComplete', pipeline);
    pipeline.pipe(require('./callback')(callback));
  }
};
