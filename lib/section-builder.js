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
  plumber = require('gulp-plumber'),
  callbackHandler = require('gwm-util').callback,
  sectionEntryPoint = require('./section-entry-point');

module.exports = function(options, callback) {
  var plugins = options.plugins;

  return function() {
    gutil.log('gulp-web-modules:section-builder: building section: \'' + options.section + '\'');

    var blocker = join(callback);
    handleJavascriptFiles(blocker.newCallback());
    handleCSSFiles(blocker.newCallback());
    handleAdditional(blocker.newCallback());
    blocker.complete();
  };

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

  function loadQueue(options) {
    return through.obj(function(file, enc, cb) {
      var buffers = [];
      if (options.isBase) {
        buffers.push(file.contents);
      } else {
        buffers.push(file.contents);
      }
      file.contents = Buffer.concat(buffers);
      this.push(file);
      cb();
    });
  }

  function handleAdditional(callback) {
    // FIXME add additional section builders
  }

  function handleJavascriptFiles(jsCallback, noWatch) {
    var pluginContext = 'javascript',
        callbackExecuted;

    if (options.watch && !noWatch) {
      var watchGlobs = util.pluginGroupGlobs(pluginContext, options);
      watchGlobs.push(options.srcPath + 'js/**/*');
      util.src(watchGlobs, options)
          .pipe(newPlumber())
          .pipe(watch({}, function() {
            handleJavascriptFiles(!callbackExecuted && callback, true);
            callbackExecuted = true;
          }));
      if (callback) {
        callback();
      }
      return;
    }

    var pipeline = gulp.src(options.srcPath + 'js/**/*');
    pipeline = pipeline.pipe(sectionEntryPoint(options));
    pipeline = util.pipeIf('beforeMerge', pluginContext, pipeline, options);
    var browserifyTransforms = util.pluginGroup('transform', pluginContext, options).map(function(entry) {
      return entry.plugin;
    });
    // filter all js files so only the entry file is present
    var fileName = '/js/__entry.js';
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
    pipeline = pipeline.pipe(loadQueue(options));

    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    if (!noWatch) {
      pipeline.pipe(callbackHandler(callback));
    }
  }

  function handleCSSFiles(callback, noWatch) {
    var pluginContext = 'css',
        callbackExecuted;

    if (options.watch && !noWatch) {
      var watchGlobs = util.pluginGroupGlobs(pluginContext, options);
      watchGlobs.push(options.srcPath + 'styles/**/*');
      util.src(watchGlobs, options)
          .pipe(newPlumber())
          .pipe(watch({}, function() {
            handleCSSFiles(!callbackExecuted && callback, true);
            callbackExecuted = true;
          }));
      if (callback) {
        callback();
      }
      return;
    }

        sectionBuildPlugins = util.pluginGroupGlobs(pluginContext, options);
    sectionBuildPlugins.push(options.srcPath + 'styles/**/*');
    var pipeline = util.src(sectionBuildPlugins, options);

    pipeline = util.pipeIf('beforeMerge', pluginContext, pipeline, options);
    pipeline = pipeline.pipe(require('./css-concat')(options));
    pipeline = util.pipeIf('afterMerge', pluginContext, pipeline, options);
    pipeline = pipeline.pipe(rename(options.section + '.css'));
    pipeline = pipeline.pipe(gulp.dest('./build/sections'));
    pipeline = util.pipeIf('complete', pluginContext, pipeline, options);
    if (!noWatch) {
      pipeline.pipe(callbackHandler(callback));
    }
  }
};

function trim(str) { return str.replace(/^\s+|\s+$/g, ''); }
function newPlumber() {
  return plumber({
    errorHandler: function(error) {
      gutil.log(
          gutil.colors.cyan('Plumber') + ' found unhandled error:',
          gutil.colors.red(trim(error.toString())));
      console.log("\007");
    }
  });
}
