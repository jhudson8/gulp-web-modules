var fs = require('fs'),
    wrapper = require('./wrapper'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    filter = require('gulp-filter'),
    path = require("path"),
    map = require("map-stream"),
    debug = require("gulp-debug");

module.exports = function(dirName, dirPath, options) {
  console.log('building module: ' + dirName);

  function renameModuleFilesToBuild() {
    function rename(file, callback) {
      var relativePath = path.relative(file.cwd, file.path),
          buildFileName = options.buildPath + '/' + relativePath;
      file.path = path.join(file.cwd, buildFileName);
      var parts = file.path.split('/');
      parts.pop();
      file.base = parts.join('/') + '/';
      callback(null, file);
    }
    return map(rename);
  }

  var wrapOptions = {
        primarySection: (dirName === options.primarySection),
        buildType: options.buildType,
      },
      moduleHeader = genereateSectionHeader(wrapOptions),
      moduleFooter = genereateSectionFooter(wrapOptions);

      gulp.src([dirPath + '/**/*'])
          .pipe(options.onSectionPreBrowserify())
          .pipe(gulp.dest(options.buildPath + '/sections/' + dirName))
          .pipe(renameModuleFilesToBuild())
      .pipe(filter(function(file) {
          return file.path.match(/\/main.js/)
        }))
      .pipe(browserify())
      .pipe(wrapper(dirName, { header: moduleHeader, footer: moduleFooter }))
      .pipe(rename(dirName + '.js'))
      .pipe(gulp.dest(options.buildPath + '/sections'));
}

function genereateSectionHeader(options) {
  var moduleHeader = '';
  if (!options.primarySection) {
      moduleHeader += 'define(function() { var sectionExports = {};\n';
  } else {
    moduleHeader += 'if (typeof self === \'undefined\') { var self = {}; }\n';
    var configFileName = './config/' + options.buildType + '.json';
    if (fs.existsSync(configFileName)) {
      moduleHeader += ('self.config = ' + fs.readFileSync(configFileName) + ';\n');
    }
  }
  moduleHeader += 'function requireSection (name, callback) { var names = Array.isArray(name) ? name : [name]; for (var i=0; i<names.length; i++) { names[i] = \'sections/\' + names[i]; }\n';
  moduleHeader += 'require(names, callback); }\n';
  return moduleHeader;
}

function genereateSectionFooter(options) {
  var moduleFooter = '';
  if (!options.primarySection) {
      moduleFooter += '\nreturn sectionExports; });';
  }
  return moduleFooter;
}
