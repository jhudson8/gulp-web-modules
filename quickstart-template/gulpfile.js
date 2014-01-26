// Include gulp
var gulp = require('gulp')
    modules = require('gulp-web-modules');

var modules = require('gulp-web-modules')({
  devServer: {
    mocks: {
      prefix: '/services/'
    }
  },
  plugins: function(plugins) {
    return [
     plugins.handlebars(require('handlebars')),
     plugins.react(require('gulp-react')),
     plugins.lib({
      priority: ['react-*']
     })
    ]
  }
}).injectTasks(gulp);
