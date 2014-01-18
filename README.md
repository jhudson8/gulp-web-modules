gulp-web-modules
================

A set of gulp tasks that that make modular development of javascript web applications easy.

Javascript files can be created and referenced just like node artifacts.  These are packaged toger using browserify.  Your application can be divided into sections which can be asychronously loaded to reduce initial download size.

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
```
gulp generate-example
```
```
gulp watch
```
Then, just browse build/index.html


How does it work?
==================
Your application has a specific structure.
```
config
  |-- dev.json
  |-- production.json
  |-- {environment}.json
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
```sections/base/main.js``` should be included from your HTML file as it is the application entry point.  Within this (and any) file you can reference other javascript files.


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

requireSection('another-section', function(anotherSectionExports) {
    alert(anotherSectionExports.somethingImportant);
});

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


Play with the example
-------------
* ```git clone git@github.com:jhudson8/gulp-web-modules.git```
* ```cd gulp-web-modules/example/```
* ```npm install```
* ```gulp watch```
* ```browse to build/index.html```
