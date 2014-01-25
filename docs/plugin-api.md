Lifecycle Plugins
===============
There are many different events used to hook into the gulp pipeline with your own build requirements.  A plugin is used to access these events.  Example plugins can be seen [here](https://github.com/jhudson8/gulp-web-modules/tree/master/plugins).

A plugin is simply a hash that contains any of the attributes described below.  Usually the module exports a function whih can accept plugin options and returns the plugin hash values.


Example plugin method
--------------
```javascript
    // options: the gulp options (see "options" section)
    // pipeline: the current gulp pipeline which *must* be returned 
    function(options, pipeline) {
      // hook into the pipeline
      pipeline = pipeline.pipe(...);

      return pipeline;
    }
  }
```

Options
-------------
    * entry: the section entry point javascript file ("index.js")
    * buildPath: the build path (shouldn't be used directly for sectional hooks)
    * srcPath: (section specific) the source path of the current section (eg: "/sections/foo/")
    * tmpPath: path used to store temporary files if that is required;  this should be avoided if possible
    * isBase: (section specific) true if the current section is the base section and false if not
    * section: (section specific) the name of the current section (eg: "foo")

Plugin Attributes
=================
The following are all of the attributes that are applicable for a section.  When appropriate, each attribute has an additional "Base" attribute which will only be applifed if the current section being processed is the base section.  Otherwise (for section specific attributes) they will be applied to any sections.

javascriptGlob
--------------
Array which can add to the glob used to obtain the javascript files for the sectional javascript build.  Each element in the array will be prefixed with the appropriate section location.  An example plugin which uses this is [handlebars plugin](https://github.com/jhudson8/gulp-web-modules/blob/master/plugins/handlebars.js).

beforeBrowserify (& beforeBrowserifyBase)
--------------
For javascript files (or files that will contribute to javascript files).  This will be executed before all javascript files within a section are joined using [browserify](http://browserify.org/).  An example is the [handlebars plugin](https://github.com/jhudson8/gulp-web-modules/blob/master/plugins/handlebars.js).

afterBrowserify (& afterBrowserifyBase)
--------------
Will be executed for the single javascript file which was the result of the [browserify](http://browserify.org/) execution.  This is before the file is wrapped with gulp-web-module code which makes referring to async section dependencies easy.

javascriptComplete (& javascriptCompleteBase)
--------------
Executed after the gulp-web-module code is added to the section javascript file.

cssGlob
--------------
Array which can add to the glob used to obtain the css files for the sectional css build.  Each element in the array will be prefixed with the appropriate section location.

beforeCSSConcat (& beforeCSSConcat)
--------------
All css files will be joined to make a single file for each section.  This will be executed for each file individually.

afterCSSConcat (& afterCSSConcatBase)
--------------
Executed after the css files have been joined to a single css file for each section.
