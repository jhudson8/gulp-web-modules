Quick Start
==============

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
