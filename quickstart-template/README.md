This is the gulp-web-module quickstart application.  It assumes a gulpfile as follows
```javascript
var gulp = require('gulp')
    modules = require('gulp-web-modules');

  // not required if you do not want to serve out mock files
  devServer: {
    mocks: {
      prefix: '/services/'
    }
  },

  // plugins are not required for your application but the this example uses them
  plugins: function(plugins) {
    return [
      // precompile all handlebars templates
      plugins.handlebars(require('handlebars')),

      // precompile all react.js jsx templates
      plugins.react(require('gulp-react')),

      // merge all file content in ./lib to the base application javascript code
      plugins.lib()
    ]
  }
}).injectTasks(gulp);
```

The handlebars plugin require the handlebars object to be passed in so we need to included it in the package.json
```javascript
  "devDependencies": {
    "gulp": "~3.5",
    "gulp-web-modules": "~0.1",

    "handlebars": "~1.3",
    "gulp-react": "~0.1"
  }
```
*note*: `handlebars` and `gulp-react` are optional dependencies but required for this example.

After you install the modules you are ready to build and run the application.

    > npm install

    > gulp watchrun

browse to [http://localhost:8080](http://localhost:8080)

See the [general documentation](https://github.com/jhudson8/gulp-web-modules/blob/master/docs/index.js) for more details.