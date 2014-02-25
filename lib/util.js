var gwmUtil = require('gwm-util');

module.exports = {
  src: function(globs, options) {
    var pipeline = options.gulp.src(globs);
    return pipeline;
  },

  pluginGroupGlobs: function (context, options) {
    var globList = this.pluginGroup('glob', context, options),
        normalized = [];

    for (var i in globList) {
      var glob = (typeof globList[i].glob === 'function') ? globList[i].glob() : globList[i].glob;
      if (Array.isArray(glob)) {
        normalized.push.apply(normalized, glob);
      } else {
        normalized.push(glob);
      }
    }
    for (var i in normalized) {
      var glob = normalized[i];
      if (glob.indexOf('!') === 0) {
        normalized[i] = '!' + options.srcPath + normalized[i].substring(1);
      } else {
        normalized[i] = options.srcPath + normalized[i];
      }
    }

    return normalized;
  },

  pluginGroup: function(name, context, options) {
    var rtn = [],
        plugins = options.plugins;
    for (var i in plugins) {
      var plugin = plugins[i][context];
      if (plugin && plugin[name]) {
        var eventPlugin = plugin[name];
        rtn.push({glob: plugin.glob, plugin: plugin[name]});
      }
    }

    return rtn;
  },

  pipeIf: function(name, context, pipeline, options, callback) {
    var plugins = this.pluginGroup(name, context, options),
        basePlugins = options.isBase ? this.pluginGroup(name + 'Base', context, options) : [];
    if (plugins.length === 0 && basePlugins.length === 0) {
      return pipeline;
    } else {
        function doPlugin(plugins) {
        for (var i in plugins) {
          var plugin = plugins[i];
          if (plugin.glob) {
            var glob = (typeof plugin.glob === 'function') ? plugin.glob() : plugin.glob;
            var filter = gwmUtil.filter(glob);
            pipeline = pipeline.pipe(filter.filter);
            pipeline = plugin.plugin(options, pipeline);
            pipeline = pipeline.pipe(filter.restore);
          } else {
            pipeline = plugins[i].plugin(options, pipeline);
          }
        }
      }

      doPlugin(plugins);
      doPlugin(basePlugins);

      return callback && callback(pipeline) || pipeline;
    }
  }
}