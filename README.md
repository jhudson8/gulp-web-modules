gulp-web-modules
================

A set of gulp tasks that that make modular development of javascript web applications easy.  It provides:
* build process which compiles using [browserify](http://browserify.org/) for javascript files within defined "sections" for synchronous access and each "section" generated javascript code wrapped in [requirejs](http://requirejs.org/) define functions for asynchronous "section" access.
* a development server which serves your application and mock files but can also be plugged in for enhanced functionality
* predefined gulp tasks to allow you to be developing your application with no setup time
* deployment type specific configuration injection from a separate json configuation file

While these tasks do add a small amount of code to your application, it is only in the areas of javascript file modularization - no assumptions are being made about what technologies are used to actually create your application.  It is basically automatically building in references to [browserify](http://browserify.org/) when it makes sense and [requirejs](http://requirejs.org/) when it makes sense.
* [browserify](http://browserify.org/) to modularize javascript files but allow them to be compiled to a single javascript file to reduce download overhead and provide synchronous code access
* [requirejs](http://requirejs.org/) to keep you from having to create a single artifact that will serve the whole single page application

Get More Information
------------
See the [docs](./docs/index.md) to understand how to use these gulp tasks, build your modular application and use the development server.

Quick Install
------------
View the [quick install guide](./docs/quick-install.md)