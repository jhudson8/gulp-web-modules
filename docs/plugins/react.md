Plugin: ReactJS
==============

Precompile all react templates (*.jsx) and javascript files with first line as ```/** @jsx React.DOM */``` to standard javascript.

This is a very light wrapper around [gulp-react(https://github.com/sindresorhus/gulp-react) used to attach to the appropriate lifecycle event.

Gulpfile
-----------

```javascript
    // Include gulp
    var gulp = require('gulp')
        modules = require('gulp-web-modules');

    var modules = require('gulp-web-modules')({
      plugins: function(plugins) {
        return [
          plugins.react(require('gulp-react')),
        ]
      }
    }).injectTasks(gulp);
```

Requirements
-----------
gulp-react is not distributed with this package so ```require('gulp-react')``` must be provided to the plugin.  You would also need to include gulp-react in package.json
```json
  "devDependencies": {
    "gulp-react": "~0.1",
  }
```