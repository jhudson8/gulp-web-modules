var gulp = require('gulp'),
    util = require('./util');

module.exports = function(options) {
  return {
    build: function() {
      var pipeline = util.src(['public/**/*'], options);
      pipeline = util.pipeIf('public', pipeline, options);
      pipeline = pipeline.pipe(gulp.dest(options.buildPath));
    }
  }
};
