This is the gulp-web-module quickstart application.  It assumes a gulpfile as follows
    var gulp = require('gulp')
        modules = require('gulp-web-modules');

    var modules = require('gulp-web-modules')({

      // add dev server configuration
      devServer: {
        mocks: {
          prefix: '/services/'
        }
      },

      // add plugins required for this example application
      plugins: function(plugins) {
        return [
          // precompile all handlebars (.hbs) templates to a single module called 'templates'
          plugins.handlebars(require('handlebars')),

          // copy all content from the resources in the lib directory to the javascript base module
          plugins.lib()
        ]
      }

    // inject all available tasks into this gulpfile
    }).injectTasks(gulp);

The handlebars plugin require the handlebars object to be passed in so we need to included it in the package.json
    "devDependencies": {
      "gulp-web-modules": "~0.1",
      "handlebars": "~1.3"
    }

After you install the modules you are ready to build and run the application.
    npm install

    gulp watchrun

browse to http://localhost:8080