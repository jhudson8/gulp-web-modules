var sectionBuilder = require('./lib/section-builder'),
    clean = require('gulp-clean'),
    through = require("through2"),
    path = require('path'),
    asyncJoin = require('gwm-util').asyncJoin,
    devServer = require('gwm-dev-server'),
    fs = require('fs');
    plugins = [],
    devServerPlugins = [],
    gulp = undefined;

function initServer(options) {
  // merge primary options into dev server options for plugin access
  var merged = merge(options.devServer, options);
  if (options.devServer) {
    delete options.devServer;
  }

  // these server plugins were registered with web-module plugins
  var server = devServer(merged);

  // add dev server plugins regered from standard plugins
  for (var i in options.plugins) {
    var plugin = options.plugins[i];
    if (plugin.devServer) {
      server.addPlugin(plugin.devServer);
    }
  }

  return server;
}

function merge(options, mergeOptions) {
  if (mergeOptions && options) {
    var rtn = {}, name;
    for (name in options) {
      rtn[name] = options[name];
    }
    for (name in mergeOptions) {
      rtn[name] = mergeOptions[name];
    }
    return rtn;
  } else {
    return options || mergeOptions;
  }
}

function initOptions(options) {
  options = options || {};
  options.gulp = gulp;
  if (typeof options.plugins === 'function') {
    options.plugins = options.plugins();
  }

  var defaults = function(base, ext) {
    for (var name in ext) {
      if (!base[name]) {
        base[name] = ext[name];
      }
    }
  };

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

  function build(options) {
      buildSections(options);
      buildPublic(options);
  }

  function buildPublic(options) {
    require('./lib/public-builder')(options).build();
  }

  function buildSections(_options, _callback) {
    var sectionDirs = fs.readdirSync('./sections'),
        filePrefix = './sections',
        blocker = asyncJoin(_callback),
        callback, options;

    // base section
    options = merge(_options, {
      srcPath: './',
      tmpPath: 'build/_tmp/sections/base/',
      buildPath: './build/sections/base',
      section: 'base',
      isBase: true
    });
    callback = blocker.newCallback();
    sectionBuilder(options, callback)();

    // additional sections
    for (var i in sectionDirs) {
      var name = sectionDirs[i];
      if (name.indexOf('.') !== 0) {
        options = merge(_options, {
          srcPath: filePrefix + '/' + name + '/',
          tmpPath: 'build/_tmp/sections/' + name + '/',
          buildPath: './build/sections/',
          isBase: (name === 'base'),
          section: name
        });

        callback = blocker.newCallback();
        sectionBuilder(options, callback)();
      }
    }

    blocker.complete();
  }

  return {
    injectTasks: function (_gulp, tasks) {
      var i;
      gulp = _gulp;
      options = initOptions(options);

      if (!tasks) {
        tasks = [];
        for (i in this) {
          if (i !== 'injectTasks' && i !== 'plugins') {
            tasks.push(i);
          }
        }
      }

      for (i=0; i<tasks.length; i++) {
        var task = tasks[i];
        if (this[task]) {
          gulp.task(task, this[task]);
        } else {
          throw "invalid gulp-web-module task '" + task + "'";
        }
      }
      gulp.task('wr', this.watchrun);

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
      gulp.src(__dirname + '/jumpstart-template/*/**').pipe(gulp.dest('./'));
    }
  };
};
