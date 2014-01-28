var builder = require('./lib/builder'),
  gulp = require('gulp'),
  clean = require('gulp-clean'),
  through = require("through2"),
  path = require('path'),
  asyncJoin = require('gwm-util').asyncJoin,
  fs = require('fs')
  plugins = [],
  devServerPlugins = [];

function initServer(options) {

  // these server plugins were registered with web-module plugins
  var server = require('./lib/dev-server')(options.devServer);

  // add dev server plugins regered from standard plugins
  for (var i in options.plugins) {
    var plugin = options.plugins[i];
    if (plugin.devServer) {
      server.addPlugin(plugin.devServer);
    }
  }

  // now add the plugins registered with basic web-module config
  var serverOptions = options.devServer;
  var knownServerPlugins = {
    mocks: './lib/dev-server/mock-server'
  }
  for (var key in knownServerPlugins) {
    if (serverOptions[key]) {
      var plugin = require(knownServerPlugins[key])(serverOptions[key]);
      server.addPlugin(plugin);
    }
  }

  // add the root devserver plugins
  server.addPlugin(require('./lib/dev-server/public-resources'));
  server.addPlugin(require('./lib/dev-server/admin-config'));

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
    options.plugins = options.plugins();
  }

  var defaults = function(base, ext) {
    for (var name in ext) {
      if (!base[name]) {
        base[name] = ext[name];
      }
    }
  }

  defaults(options, {
    buildType: gulp.env.type || 'dev',
    plugins: [],
    entry: 'index.js',
    primarySection: 'base',
    buildPath: 'build/',
    devServer: {}
  });

  defaults(options.devServer, {
    defaultServResource: 'index.html',
    port: '8080'
  });
  options.devServer.base = options.buildPath;

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
        blocker = asyncJoin(_callback);

    for (var i in sectionDirs) {
      var name = sectionDirs[i];
      options = merge(options, {
        srcPath: filePrefix + '/' + name + '/',
        tmpPath: 'build/_tmp/sections/' + name + '/',
        buildPath: './build/sections/',
        isBase: (name === 'base'),
        section: name
      });

      var callback = blocker.newCallback();
      sectionBuilder(options, callback)();
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
