What is a "Module"?
===================
This is a term for all javascript files that exist within a single [section](./sections.md).  It is a self-contained bit of javascript in a file within a section directory.  These modules can expose data and functions to other modules using `module.exports` or simply `exports`.  See (common.js)[FIXME] module definition for more details.

Within each section, you must create an index.js file.  The exports from this file will actually be used as the exports of the entire section.  See [section docs](./sections.md) for a better understanding of a section.

Access to other modules
----------
Assuming the following directory structure exists:
```
  sections
    > base
      > index.js
      > module1.js
```
I can access `module1` exports from `index.js`

sections/base/index.js
```javascript
// the provided path must always be relative to the current file (must always start with ./ or ../)
var myValue = require('./module1').foo();

// expose this value to the section exports
exports.bar = myValue;
```

sections/foo/module.js
```javascript
exports.foo = function() {
  // return a global value that was set in another module using 'global'
  return 'hello';
}
```
