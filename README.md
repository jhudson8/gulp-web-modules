gulp-web-modules
================

A set of gulp tasks that that make modular development of javascript web applications easy.

Javascript files can be created and referenced just like node artifacts.  These are packaged toger using browserify.  Your application can be divided into sections which can be asychronously loaded to reduce initial download size.

You are not forced into any particular MVC framework - this just provides the infrastructure to build, package and reference your javascript files in a modular way.

Quick Install
=================
This module can inject targets into your gulpfile ('clear', 'build', 'watch', 'package')

Add this to package.json
```
  "devDependencies": {
    "gulp": "...",
    "gulp-web-modules": "..."
  }
```
Add this to your gulpfile
```
require('gulp-web-modules').injectTasks(gulp);
```
That's it!  Now you can run:
* ```gulp clean```
* ```gulp watch``` build the application and watch for any changes
* ```gulp watchrun``` watch task and run a local server to view your app on ```localhost:8080```


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
         |-- main.js
         |-- {other files or directories}
  |-- {another section}
         |-- main.js
         |-- {other files or directories}
  |-- public
         |-- index.html (for example)
         |-- {any files to be copied to the root package structure}
```
```sections/base/main.js``` should be included from your HTML file as it is the application entry point.  Within this (and any) file under the same section directory you can reference other javascript files using a node-style API.  Each section has an entry point which will be evaluated automatically when that section is loaded which is {section name}/main.js.


Module and section exports
===============

inter-section require 
--------------
You can asynchronously retrieve another section's exports using ```requireSection```

```requireSection('another-section', function(sectionExports) { ... } )``` will execute the callback function with the exports from the section located in ```sections/another-section```.
```
// base section entry point (sections/base/main.js)
// will be executed when this section is referenced
// should *not* reference module.exports

// execute another section and alert it's exported content
requireSection('another-section', function(anotherSectionExports) {
    alert(anotherSectionExports.somethingImportant);
});

// set a value which all sections have access to
global.somethingReallyImportant = 'hello';
```

intra-section require
-------------
Intra-section modules should be treated basically the same as node modules.  These will all be packaged in the same javascript file using browserify.

If the javascript files are within the same section (both in sections/{the same section}).

```require('./another-module')``` will reference a sibling javascript file named ```another-module.js```.
```
// example main.js (sections/another-section/main.js)
var somethingImportant = require('./another-module').getSomethingImportant();

// 'sectionExports' allows modules to provide content to other sections
// any module can populate to sectionExports
sectionExports.somethingImportant = somethingImportant;
```
And another file in the same section...
```
// example non-base module (sections/another-section/another-module.js)
// would most likely use module.exports (or exports)
module.exports = {
    getSomethingImportant: function() { return global.somethingReallyImportant; }
}

```
An application with the examples above will alert "hello".  This is because
* the application base section sets the global value ```somethingReallyImportant``` to ```hello```
* the application base section makes an async reference to ```another-section``` and alerts the section export value ```somethingImportant```
* the ```another-section``` section base module calls the exported function ```getSomethingImportant``` from a sibling module called ```another-module```
* the ```another-section``` base module sets the value as ```somethingImportant``` in ```sessionExports```
* the ```another-module``` module implements the ```getSomethingImportant``` by returning the global value ```somethingReallyImport``` (which was set in the base module)

While the example is a little silly, hopefully it demonstrates how modules and sections can talk to eachother.

Lifecycle Hooks
===============
Other gulp plugins can be hooked into the build process.  In fact, the example referenced below adds ReactJS into the build cycle so all .jsx files are automatically converted.  See more in the Wiki but it's as simple as
```
    var gulp = require('gulp')
        modules = require('gulp-web-modules'),
        react = require('gulp-react');
    
    modules({
      onSectionPreBrowserify: function() {
        // compile all .jsx modules to javascript
        return react();
      }
    }).injectTasks(gulp);

```

Global Javascript Libraries
==============
Any javascript files included in the ```lib``` directory will be copied to the base section file so the only file that needs to be referenced from your html file is the base section javascript file.  The example referenced below uses this directory to include the react.js code.

Play with the example
===============
View the [source code](https://github.com/jhudson8/gulp-web-modules/tree/master/example)
* ```git clone git@github.com:jhudson8/gulp-web-modules.git```
* ```cd gulp-web-modules/example/```
* ```npm install```
* ```gulp watch```
* ```browse to build/index.html```
