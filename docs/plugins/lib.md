Plugin: lib
==========
The lib plugin will insert the contents of all files from the `lib` directory into the base javascript file.

Options
----------
* priority: array of file names (can include '*' for wildcard) to be inluded first

Gulpfile
----------
```javascript
    // Include gulp
    var gulp = require('gulp')
        modules = require('gulp-web-modules');

    modules({
      plugins: function(plugins) {
        return [
          plugins.lib({
            priority: ['foo-*']
          })
        ]
      }
    }).injectTasks(gulp);
```
