gulp-web-modules
================

A set of gulp tasks that that make modular development of single page  web applications easy.

Your a
  It provides:
* build process which compiles using [browserify](http://browserify.org/) for javascript files within defined "sections" for synchronous access with each "section" generated javascript code wrapped in [AMD](http://requirejs.org/docs/whyamd.html) define functions for asynchronous "section" access.
* a development server which serves your application and mock files but can also be plugged in for enhanced functionality
* predefined gulp tasks to allow you to be developing your application with no setup time
* deployment type specific configuration injection from a separate json configuation file

While these tasks do add a small amount of code to your application, it is only in the areas of javascript file modularization - no assumptions are being made about what technologies are used to actually create your application.  It is basically automatically building in references to [browserify](http://browserify.org/) when it makes sense and [AMD](http://requirejs.org/docs/whyamd.html) when it makes sense.
* [browserify](http://browserify.org/) to modularize javascript files but allow them to be compiled to a single javascript file to reduce download overhead and provide synchronous code access
* [AMD](http://requirejs.org/docs/whyamd.html) to keep you from having to create a single artifact that will serve the whole single page application

Quick Start
------------
Add gulp-web-modules to package.json
```json
    "dependencies": {
      "gulp-web-modules": "*"
    }
```

Inject the gulp-web-module tasks with gulpfile.js
```javascript
    var gulp = require('gulp'),
        gwm = require('gulp-web-modules');

    gwm({}).injectTasks(gulp);
```

Install the modules and run the jumpstart task
```
    npm install
    gulp jumpstart
    gulp watchrun
```
Now browse to [localhost:8080](http://localhost:8080)

Plugins
-----------
There are many plugins can be used to enhance the build functionality.  These can be seen [here](https://npmjs.org/search?q=gulpWebModulePlugin.

Project File Structure
-----------
```
|- config (if using gwm-config)
   |- dev.json
   |- prod.json
|- js
   |- index.js (application entry point)
   |- lib (if using gwm-lib)
      |- lib files to be prepended to application js file
|- public
   |- index.html (example file which will be copied to the build output)
|- sections (additional optional "sections" for asynchronous module loading)
  |- some-section-name
     |- index.js (section entry point - use module.exports to export section content)
     |- lib (if using gwm-config)
        |- ...
|- styles
   |- css files (others can be used with additional plugins)
```

For [bower](http://bower.io/) support, refer to the [gwm-lib](https://github.com/jhudson8/gwm-lib) plugin.

Dev Server
------------
When using ```gulp watch```, ```gulp watchrun``` or ```gulp wr``` (shorthand for ```gulp watchrun```), the [gwm-dev-server](https://github.com/jhudson8/gwm-dev-server) server is executed.  This can be configured using the options as shown on that page.  An example is below:
```
    var gulp = require('gulp'),
        gwm = require('gulp-web-modules');

    gwm({
        devServer: {
            port: 8000,
            mocks: {
                prefix: '/api'
            }
        }
    }).injectTasks(gulp);

```
