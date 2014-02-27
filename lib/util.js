var gwmUtil = require('gwm-util');

module.exports = {
  src: function(globs, options) {
    var pipeline = options.gulp.src(globs);
    return pipeline;
  },

  pluginGroupGlobs: function (context, options) {
    var globList = this.pluginGroup('watch', context, options),
        normalized = [];

    for (var i in globList) {
      var glob = (typeof globList[i].watch === 'function') ? globList[i].watch(options) : globList[i].watch;
      if (glob) {
        if (Array.isArray(glob)) {
          normalized.push.apply(normalized, glob);
        } else {
          normalized.push(glob);
        }
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
        rtn.push({watch: plugin.watch, plugin: plugin[name]});
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
          pipeline = plugins[i].plugin(options, pipeline);
        }
      }

      doPlugin(plugins);
      doPlugin(basePlugins);

      return callback && callback(pipeline) || pipeline;
    }
  }
}