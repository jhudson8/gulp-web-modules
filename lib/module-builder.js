var fs = require('fs'),
    wrapper = require('./wrapper'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass');

module.exports = function(dirName, dirPath, options) {
  console.log('building module: ' + dirName);

  if (options.scss) {
    // Compile Our Sass
    var stylesheet = dirPath + '/*.scss';
    var stylesheetExists = fs.existsSync(stylesheet);
    if (stylesheetExists) {
        gulp.src(stylesheet)
            .pipe(sass())
            .pipe(rename(dirName + '.css'))
            .pipe(gulp.dest(options.buildPath + '/modules'));
    }
  }


  // create module javascript
  gulp.src([dirPath + '/' + options.entry])
      .pipe(browserify({}))
      .pipe(wrapper(dirName, {includeStyleSheet: stylesheetExists, addDefines: (dirName != options.primaryModule)}))
      .pipe(rename(dirName + '.js'))
      .pipe(gulp.dest(options.buildPath + '/modules'));
}