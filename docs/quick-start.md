Quick Install
=============


package.json
------------
Add the `gulp-web-modules` dependency and additional `handlebars` and `gulp-react` that will be used for this example.
```javascript
  "devDependencies": {
    "gulp": "~3.5",
    "gulp-web-modules": "~0.1",

    // the following are only required for optional plugins (but used for this example)
    "handlebars": "~1.3",
    "gulp-react": "~0.1"
  }
```

gulpfile.js
-----------
Add the builder tasks to your gulpfile.  This is a sample gulpfile configured to serve out mock files as well
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

Jumpstart Task
--------------
After installing the new modules
```
npm install
```

Execute the `jumpstart` task to build a boilerplate application
```
gulp jumpstart
```

Start the dev server and watch for file changes
```
gulp watchrun
```

Take a look at your app on localhost:8080;  You can also turn on the mock integration by browsing to localhost:8080/$admin.

See the [general documentation](./index.md) for more details.