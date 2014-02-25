var fs = require('fs'),
  through = require('through2'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  gutil = require('gulp-util'),
  filter = require('gulp-filter'),
  path = require("path"),
  join = require('gwm-util').asyncJoin,
  util = require('./util'),
  watch = require('gulp-watch'),
  map = require('map-stream'),
  callbackHandler = require('gwm-util').callback,
  sectionEntryPoint = require('./section-entry-point');

module.exports = function(options, callback) {
  var plugins = options.plugins;

  return function() {
    gutil.log('gulp-web-modules:section-builder: building section: \'' + options.section + '\'');

    var blocker = join(callback);
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

  function setGlobal() {
    return through.obj(function(file, enc, cb) {
      file.contents = Buffer.concat([new Buffer('\nvar self=(typeof window!=="undefined")?window:{};var global=self;'), file.contents]);
      this.push(file);
      cb();
    });
  }

  function handleAdditional(callback) {
    // FIXME add additional section builders
  }

  function handleJavascriptFiles(jsCallback, noWatch) {
    var pluginContext = 'javascript',
        callbackExecuted,
        sectionBuildPlugins = util.pluginGroupGlobs(pluginContext, options);
    sectionBuildPlugins.push(options.srcPath + 'js/**/*.js');

    if (options.watch && !noWatch) {
      util.src(sectionBuildPlugins, options)
          .pipe(watch())
          .pipe(callbackHandler(undefined, function() {
            handleJavascriptFiles(!callbackExecuted && callback, true);
            callbackExecuted = true;
          }))
      callback && callback();
      return;
    }

    var pipeline = util.src(sectionBuildPlugins, options);
    pipeline = pipeline.pipe(sectionEntryPoint(options));
    pipeline = util.pipeIf('beforeMerge', pluginContext, pipeline, options);
    var browserifyTransforms = util.pluginGroup('transform', pluginContext, options).map(function(entry) {
      return entry.plugin;
    });

    // filter all js files so only the entry file is present
    var fileName = options.section + '/js/__entry.js';
    pipeline = pipeline.pipe(filter(function(file) {
      if (file.path.indexOf(fileName) >= 0) {
        return true;
      }
    }));

    var browserifyOptions = {};
    if (options.browserify) {
      for (var name in options.browserify) {
        browserifyOptions[name] = options.browserify[name];
      }
    }
    if (browserifyOptions.transform) {
      browserifyOptions.transform.push.apply(browserifyOptions.transform, browserifyTransforms);
    }
    pipeline = pipeline.pipe(browserify(browserifyOptions));

    pipeline = pipeline.pipe(rename(options.section + '.js'));
    pipeline = util.pipeIf('afterMerge', pluginContext, pipeline, options);
    pipeline = pipeline.pipe(require('./section-content-wrapper')(options));
    pipeline = util.pipeIf('complete', pluginContext, pipeline, options);
    if (options.isBase) {
      pipeline = pipeline.pipe(setGlobal());
    }

    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    if (!noWatch) {
      pipeline.pipe(callbackHandler(callback));
    }
  }

  function handleCSSFiles(callback) {
    var pluginContext = 'css',
        sectionBuildPlugins = util.pluginGroupGlobs(pluginContext, options);
    sectionBuildPlugins.push(options.srcPath + '**/*.css');
    var pipeline = util.src(sectionBuildPlugins, options);

    pipeline = util.pipeIf('beforeMerge', pluginContext, pipeline, options);
    pipeline = pipeline.pipe(require('./css-concat')(options));
    pipeline = util.pipeIf('afterMerge', pluginContext, pipeline, options);
    pipeline = pipeline.pipe(rename(options.section + '.css'))
    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    pipeline = util.pipeIf('complete', pluginContext, pipeline, options);
    pipeline.pipe(callbackHandler(callback));
  }
};
