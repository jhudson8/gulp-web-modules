What is a "Section"?
===================
The application build process is divided up different sectional builds and a larger global build.  The javascript code within each section will be packaged up together and end up in the same file using [browserify](http://browserify.org/).  Each file should be treated like a node module.  In other words, whatever is in `module.exports` or just `exports` will be available to other modules within this section.

Section Structure
----------
Each section has all associated resources in a directory matching the section name within a `sections` directory.  If I had a section called `foo`, my file structure would resemble
```
    sections
      > foo
        > index.js
```
The entry point into a section (the code that is run when a section is evaluated) is `index.js`.  This file is the only file within your section that should not contribute to `module.exports`.

Once sections are build, you will actuall end up with a file within the sections directory as {section name}.js.  In other words
```
    build
      > sections
        > foo.js
        > foo.css
```

Base Section (application entry point)
----------
A required section that every application must have is called "base".  The `index.js` file within the base section is the application entry point.  This section javascript should be included in your container html page.
```html
<script type="text/javascript" src="sections/base.js"></script>
```

Access to other Sections
----------
Since the javascript code representing each section is in a unique file, you must access it asynchronously using a callback.  A special hash called ```section.exports``` can be populated by any module within that section to contribute to what is exposed to other sections.
```javascript
requireSection('foo', function(sessionExports) {
  // sessionExports is the object that was populated from modules within the foo section
});
```

Build / Plugins
----------
Each section is build independently with corresponding lifecycle events that plugins can take advantage of to customize the build.  See [the plugin docs](./plugin-api.md) for more details.  By default, all javascript resources are compiled using [browserify](http://browserify.org/) and all css resources are concatinated.  Some additional plugin used to enhance this behavor are described [here](./plugins).