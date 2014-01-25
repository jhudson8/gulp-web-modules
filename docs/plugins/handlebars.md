Plugin: handlebars
==============

Precompile all [handlebars](http://handlebarsjs.com/) templates (`.hbs` extension) within the `templates` directory to a module in the current section called `templates`.

For example, with a project structure like this:
```
    sections
      > base
        > index.js
        > templates
          > foo.hbs
```

I would be able to execute the `foo.hbs` template with the following code from `index.js`
```javascript
    var templates = require('templates'),
        data = {thing1: 'thing2'};

    var templateResult = templates.foo(data);
```

Options
-----------
* ext: (default "hbs") the handlebars file extension
* fileName: the name of the module to be created and the top level directory name where the templates should be saved

Gulpfile
-----------

```javascript
    // Include gulp
    var gulp = require('gulp')
        modules = require('gulp-web-modules');

    var modules = require('gulp-web-modules')({
      plugins: function(plugins) {
        return [
          plugins.handlebars(require('handlebars'), {}),
        ]
      }
    }).injectTasks(gulp);
```

Requirements
-----------
Handlebars is not distributed with this package so ```require('handlebars')``` must be provided to the plugin.  You would also need to include handlebars in package.json
```json
  "devDependencies": {
    "handlebars": "~1.3"
  }
```
