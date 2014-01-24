var gulp = require('gulp'),
    watch = require("gulp-watch");

module.exports = {
  src: function(globs, options) {
    var pipeline = gulp.src(globs);
    if (options.watch) {
      pipeline = pipeline.pipe(watch());
    }
    return pipeline;
  },

  pluginGroupGlobs: function (name, options) {
    var globList = this.pluginGroup(name, options),
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
    console.log(JSON.stringify(normalized));
    return normalized;
  },

  pluginGroup: function(name, options) {
    var rtn = [],
        plugins = options.plugins;
    for (var i in plugins) {
      var plugin = plugins[i];
      if (plugin[name]) {
        rtn.push(plugin[name]);
      }
    }
    return rtn;
  },

  pipeIf: function(name, pipeline, options, callback) {
    var plugins = this.pluginGroup(name, options),
        basePlugins = this.pluginGroup(name + 'Base', options);
    if (plugins.length === 0 && basePlugins.length === 0) {
      return pipeline;
    } else {
      for (var i in plugins) {
        pipeline = plugins[i](options, pipeline);
      }
      for (var i in basePlugins) {
        pipeline = pipeline.pipe(basePlugins[i](options, pipeline));
      }

      return callback && callback(pipeline) || pipeline;
    }
  }
}