var builder = require('./lib/builder'),
  gulp = require('gulp'),
  clean = require('gulp-clean'),
  through = require("through2"),
  path = require('path'),
  join = require('./lib/async-join'),
  fs = require('fs')
  plugins = [],
  devServerPlugins = [];

var pluginFactory = {},
    knownPlugins = ['handlebars', 'lib', 'react'];
for (var i in knownPlugins) {
  var key = knownPlugins[i];
  (function(key) {
    pluginFactory[key] = function(options) {
      return require('./plugins/' + key)(options);
    }
  })(key);
}

function initServer(options) {
  var devServerPlugins = [];
  // proxy all dev server plugins
  for (var i in options.plugins) {
    var plugin = options.plugins[i];
    if (plugin.devServer) {
      devServerPlugins.push(plugin.devServer);
    }
  }

  // add the root devserver plugin
  devServerPlugins.push({
    onRequest: function (requestOptions, pluginOptions, callback) {
      var uri = requestOptions.uri;
      if (uri === '/') {
        uri = options.defaultServResource;
      }
      callback({
        fileName: path.join(requestOptions.base, uri)
      })
    }
  });
  devServerPlugins.push(require('./lib/dev-server/admin-config'));

  // these server plugins were registered with web-module plugins
  var server = require('./lib/dev-server')(merge(options, {
    plugins: devServerPlugins
  }));

  var serverOptions = options.devServer;
  if (serverOptions) {
    // now add the plugins registered with basic web-module config
    var knownServerPlugins = {
      mocks: './lib/dev-server/mock-server'
    }
    for (var key in knownServerPlugins) {
      if (serverOptions[key]) {
        var plugin = require(knownServerPlugins[key])(serverOptions[key]);
        server.addPlugin(plugin);
      }
    }
  }

  return server;
}

function merge(options, mergeOptions) {
  if (mergeOptions && options) {
    var rtn = {};
    for (var name in options) {
      rtn[name] = options[name];
    }
    for (var name in mergeOptions) {
      rtn[name] = mergeOptions[name];
    }
    return rtn;
  } else {
    return options || mergeOptions;
  }
}

function initOptions(options) {
  options = options || {};
  if (typeof options.plugins === 'function') {
    options.plugins = options.plugins(pluginFactory);
  }
  options.buildType = gulp.env.type || 'dev';
  
  var _defaults = {
    plugins: [],
    entry: 'index.js',
    primarySection: 'base',
    buildPath: 'build',
    defaultServResource: 'index.html',
    port: 8080,
    proxy: function (gulpOptions, requestOptions, callback) {
      callback();
    }
  }
  for (var i in _defaults) {
    if (options[i] === undefined) {
      options[i] = _defaults[i];
    }
  }
  return options;
}

function _clean(src) {
  gulp.src(src, {
    read: false
  }).pipe(clean());
}

module.exports = function (options) {
  options = initOptions(options);

  function build(options) {
      buildSections(options);
      buildPublic(options);
  }

  function buildPublic(options) {
    require('./lib/public-builder')(options).build();
  }

  function buildSections(options, _callback) {
    var sectionDirs = fs.readdirSync('./sections'),
        filePrefix = './sections',
        sectionBuilder = require('./lib/section-builder'),
        blocker = join(_callback);

    for (var i in sectionDirs) {
      var name = sectionDirs[i];
      options = merge(options, {
        srcPath: filePrefix + '/' + name + '/',
        tmpPath: 'build/_tmp/sections/' + name + '/',
        buildPath: './build/sections/',
        isBase: (name === 'base'),
        section: name
      });

      sectionBuilder(options, blocker.newCallback())();
    }
    blocker.complete();
  }

  return {
    injectTasks: function (gulp, tasks) {
      if (!tasks) {
        tasks = [];
        for (var i in this) {
          if (i !== 'injectTasks' && i !== 'plugins') {
            tasks.push(i);
          }
        }
      }

      for (var i in tasks) {
        var task = tasks[i];
        if (this[task]) {
          gulp.task(task, this[task]);
        } else {
          throw "invalid gulp-web-module task '" + task + "'";
        }
      }

      return this;
    },

    build: function () {
      build(options);
    },

    watch: function () {
      build(merge(options, {
        watch: true
      }));
    },

    watchrun: function () {
      build(merge(options, {
        watch: true
      }));
      initServer(options).start();
    },

    clean: function () {
      _clean(options.buildPath);
    },

    jumpstart: function() {
      gulp.src(__dirname + '/quickstart-template/*/**').pipe(gulp.dest('./'));
    },

    plugins: {
      handlebars: require('./plugins/handlebars')
    }
  }
}
