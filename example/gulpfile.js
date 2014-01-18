// Include gulp
var gulp = require('gulp')
    modules = require('gulp-web-modules'),
    react = require('gulp-react');

modules({
  onSectionPreBrowserify: function() {
    // compile all .jsx modules to javascript
    return react();
  }
}).injectTasks(gulp);
