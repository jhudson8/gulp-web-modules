var gulp = require('gulp'),
    watch = require('gulp-watch'),
    util = require('./util');


module.exports = function(options) {
  return {
    build: function() {
      var pipeline = util.src(['public/**/*'], options);
      if (options.watch) {
        pipeline = pipeline.pipe(watch());
      }
      pipeline = util.pipeIf('public', pipeline, options);
      pipeline = pipeline.pipe(gulp.dest(options.buildPath));
    }
  }
};
