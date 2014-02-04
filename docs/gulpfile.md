Gulpfile
============
This package can inject tasks into your gulpfile using `injectTasks` function.  While you can optionally define specific tasks to be injected or optional plugins and other settings, a minimal gulpfile looks like this:
```javascript
var gulp = require('gulp');

require('gulp-web-modules')().injectTasks(gulp);
```
This will allow you to work with the [default project configuration](./structure.md) and execute all of the [predefined tasks](./tasks.md).

Configuration
-------------
You can pass in additional options to customize how your dev server runs or how the build works.  The following configuration options are available:
* plugins: provide additional [plugins](./plugin-api.md) to customize behavior
* entry: (default "index.js") define the [section](./sections.md) entry javascript file
* primarySection: (default "base") define the primary [section](./sections.md) name which functions as the application entry point
* buildPath (default "build/") define the path to copy build resources to
* devServer: provide additional [dev server options](FIXME)

Example
------------
A more customized gulpfile can be seen below
```javascript
    var gulp = require('gulp')
        modules = require('gulp-web-modules');

    var modules = require('gulp-web-modules')({
      devServer: {
        mocks: {
          // allow the mock server to be enabled without turning it on with the $admin page
          enabledByDefault: true,

          // set the uri prefix for serving mock responses
          prefix: '/services/'
        }
      },

      // customize the behavior with plugins
      plugins: function(plugins) [
        ..
      ]
    }).injectTasks(gulp);
```
See (plugins)[./plugin-api] for plugin details and available plugins