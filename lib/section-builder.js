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
            .pipe(gulp.dest(options.buildPath + '/sections'));
    }
  }

  var wrapOptions = {
        primarySection: (dirName === options.primarySection),
        includeStylesheet: stylesheetExists
      },
      moduleHeader = genereateSectionHeader(wrapOptions),
      moduleFooter = genereateSectionFooter(wrapOptions);

  // create module javascript
  gulp.src([dirPath + '/' + options.entry])
      .pipe(browserify({}))
      .pipe(wrapper(dirName, { header: moduleHeader, footer: moduleFooter }))
      .pipe(rename(dirName + '.js'))
      .pipe(gulp.dest(options.buildPath + '/sections'));
}

function genereateSectionHeader(options) {
  var moduleHeader = '';
  if (!options.primarySection) {
      moduleHeader += 'define(function() { var sectionExports = {}; ';
  }
  moduleHeader += 'if (typeof global === \'undefined\') { var global = window; } function requireSection (name, callback) { var names = Array.isArray(name) ? name : [name]; for (var i=0; i<names.length; i++) { names[i] = \'sections/\' + names[i]; } ';
  if (options.includeStylesheet) {
      moduleHeader += '$(\'head\').append(\'<link rel="stylesheet" type="text/css" href="sections/' + name + '.css">\'); ';
  }
  moduleHeader += ' require(names, callback); }\n';
  return moduleHeader;
}

function genereateSectionFooter(options) {
  var moduleFooter = '';
  if (!options.primarySection) {
      moduleFooter += '\n\nreturn sectionExports; });';
  }
  return moduleFooter;
}