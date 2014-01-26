// Include gulp
var gulp = require('gulp')
    modules = require('gulp-web-modules');

var modules = require('gulp-web-modules')({
  devServer: {
    mocks: {
      prefix: '/services/'
    },
    plugins: [
      (function() {
        var store = {
          text: 'World',
          uri: '/hello'
        };

        return {
          userConfig: {
            key: 'example',
            section: 'Example',
            inputs: [
              {key: 'text', label: 'Response Text'},
              {key: 'uri', label: 'URI'}
            ],
            store: store
          },
          onRequest: function(requestOptions, pluginOptions, callback) {
            if (requestOptions.uri === store.uri) {
              callback({
                text: store.text
              });
            } else {
              callback();
            }
          }
        }
      })()
    ]
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
