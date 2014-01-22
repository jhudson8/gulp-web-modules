gulp-web-modules
================

A set of gulp tasks that that make modular development of javascript web applications easy.  It provides:
* build process which compiles using [browserify](http://browserify.org/) for javascript files within defined "sections" for synchronous access and each "section" generated javascript code wrapped in [requirejs](http://requirejs.org/) define functions for asynchronous "section" access.
* a development server which serves your application and mock files but can also be plugged in for enhanced functionality
* predefined gulp tasks to allow you to be developing your application with no setup time
* deployment type specific configuration injection from a separate json configuation file

While these tasks do add a small amount of code to your application, it is only in the areas of javascript file modularization - no assumptions are being made about what technologies are used to actually create your application.  It is basically automatically building in references to browserify when it makes sense and [requirejs](http://requirejs.org/) when it makes sense.
* browserify to modularize javascript files but allow them to be compiled to a single javascript file to reduce download overhead and provide synchronous code access
* requirejs to keep you from having to create a single artifact that will serve the whole single page application


Quick Install
=================

Add this to package.json
```json
  "devDependencies": {
    "gulp": "*",
    "gulp-web-modules": "*"
  }
```

Add the builder tasks to your gulpfile.  This is a sample gulpfile configured to serve out mocks as well
```javascript
var gulp = require('gulp')
    gulpWebModules = require('gulp-web-modules');

gulpWebModules({
  devServer: {
    mocks: {
      prefix: '/services/'
    }
  }
}).injectTasks(gulp);
```

Install the new dependency
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

Look at your app on localhost:8080;  You can turn on the mock integration by browsing to localhost:8080/$admin

That's it!  Now you can run:

* `gulp clean`
* `gulp build` build the application but do not watch for file changes
* `gulp watch` build the application and watch for any changes
* `gulp watchrun` watch task and run a local server to view your app on `[localhost:8080](http://localhost:8080)`
* `gulp package` coming soon: used to package up the application for deployment


Project structure
==================
```
config
  |-- dev.json
  |-- production.json
  |-- {environment}.json
lib
  |-- {any file to be included as a global resource in the base section}
sections
  |-- base
         |-- index.js
         |-- ...
  |-- {another section}
         |-- index.js
         |-- ...
public
  |-- index.html (for example)
  |-- {any files to be copied to the root package structure}
```
`sections/base/index.js` should be included from your HTML file as it is the application entry point.  Within this (and any) file under the same section directory you can reference other javascript files using a node-style API.  Each section has an entry point which will be evaluated automatically when that section is loaded which is {section name}/index.js.


Module and section exports
===============

inter-section dependencies (requirejs)
--------------
You can asynchronously retrieve another section's exports using `requireSection`

`requireSection('{section name}', function(sectionExports) { ... } )` will execute the callback function with the exports from the section located in `sections/{section name}`.
```javascript
// base section entry point (sections/base/index.js)
// will be executed when this section is referenced
// should *not* reference module.exports

// execute another section and alert it's exported content
requireSection('another-section', function(anotherSectionExports) {
    alert(anotherSectionExports.somethingImportant);
});

// set a value which all sections have access to
global.somethingReallyImportant = 'hello';
```

intra-section (module) dependencies (browserify)
-------------
You can synchronously retrieve another module's exports using `requre`

Intra-section modules should be treated basically the same as node modules as long as they are with the same directory under `./sections`.  These will all be packaged in the same javascript file using browserify.

`require('./{relative file name}')` will reference a sibling javascript file named `{relative file name}.js`.
```javascript
// example index.js (sections/another-section/index.js)
var somethingImportant = require('./another-module').getSomethingImportant();

// 'section.exports' allows modules to provide content to other sections
// any module can populate to section.exports
section.exports.somethingImportant = somethingImportant;
```
And another file in the same section...
```javascript
// example non-base module (sections/another-section/another-module.js)
// would most likely use module.exports (or exports)
module.exports = {
    getSomethingImportant: function() { return global.somethingReallyImportant; }
}

```
An application with the examples above will alert "hello".  This is because
* the application base section sets the global value `somethingReallyImportant` to `hello`
* the application base section makes an async reference to `another-section` and alerts the section export value `somethingImportant`
* the `another-section` section base module calls the exported function `getSomethingImportant` from a sibling module called `another-module`
* the `another-section` base module sets the value as `somethingImportant` in `section.exports`
* the `another-module` module implements the `getSomethingImportant` by returning the global value `somethingReallyImport` (which was set in the base module)

While the example is a little silly, hopefully it demonstrates how modules and sections can talk to each other.

Export Scope
------------
```module.exports```: each module can expose content that can be access synchronously by other files within the same section
```section.exports```: is used to add conent to the callback parameter when a section is loaded asynchronously
```global```: should be populated for any module to access at any time (as long as the section has been loaded which populates it)

Lifecycle Hooks
===============
Other gulp plugins can be hooked into the build process.  In fact, the example referenced below adds [ReactJS](http://facebook.github.io/react/) into the build cycle so all [.jsx](http://facebook.github.io/react/docs/jsx-in-depth.html) files are automatically converted.  See more in the Wiki but it's as simple as
```javascript
   var gulp = require('gulp')
       modules = require('gulp-web-modules'),
       react = require('gulp-react');

   modules({
     beforeBrowserify: function() {
       // compile all .jsx modules to javascript
       return react();
     }
   }).injectTasks(gulp);

```

Global Javascript Libraries
==============
Any javascript files included in the `lib` directory will be copied to the base section file so the only file that needs to be referenced from your html file is the base section javascript file.  The example referenced below uses this directory to include the react.js code.

Dev Server
===============
A server is also included to make viewing your application easy.  It has the ability to return mock files an a simple plugin architecture to
enhance it for your own needs.

To include the ability to serve out mock files, see the [simple example gulpfile](https://github.com/jhudson8/gulp-web-modules/blob/master/example/gulpfile.js#L12)

By default this starts with the mock server disabled but can be enabled by viewing localhost:8080/$admin
