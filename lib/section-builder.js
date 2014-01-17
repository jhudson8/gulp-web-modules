var fs = require('fs'),
    wrapper = require('./wrapper'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify');

module.exports = function(dirName, dirPath, options) {
  console.log('building module: ' + dirName);

  var wrapOptions = {
        primarySection: (dirName === options.primarySection),
        buildType: options.buildType,
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