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

  function handleJavascriptFiles(callback, noWatch) {
    var pluginContext = 'javascript',
        sectionBuildPlugins = util.pluginGroupGlobs(pluginContext, options);
    sectionBuildPlugins.push(options.srcPath + 'js/**/*.js');

    var _callback = (!options.watch || noWatch) ? callback : function() {
      util.src(sectionBuildPlugins, options)
          .pipe(watch())
          .pipe(callbackHandler(undefined, function() {
            handleJavascriptFiles(undefined, true);
          }))
      callback && callback();
    };

    var pipeline = util.src(sectionBuildPlugins, options);
    pipeline = pipeline.pipe(sectionEntryPoint());

    pipeline = util.pipeIf('beforeMerge', pluginContext, pipeline, options);

    var fileName = options.section + '/__entry.js';
    pipeline = pipeline.pipe(filter(function(file) {
      return (file.path.indexOf(fileName) >= 0);
    }));

    var browserifyTransforms = util.pluginGroup('transform', pluginContext, options).map(function(entry) {
      return entry.plugin;
    });

    pipeline = pipeline.pipe(browserify({transform: browserifyTransforms}));
    pipeline = pipeline.pipe(rename(options.section + '.js'));
    pipeline = util.pipeIf('afterMerge', pluginContext, pipeline, options);
    pipeline = pipeline.pipe(require('./section-content-wrapper')(options));
    pipeline = util.pipeIf('complete', pluginContext, pipeline, options);
    if (options.isBase) {
      pipeline = pipeline.pipe(setGlobal());
    }

    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    if (!noWatch) {
      pipeline.pipe(callbackHandler(_callback));
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
