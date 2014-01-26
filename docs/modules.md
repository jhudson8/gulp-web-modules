What is a "Module"?
===================
This is a term for all javascript files that exist within a single [section](./sections.md).  It is a self-contained bit of javascript that can expose data and functions to other modules using `module.exports` or simply `exports`.

The section can have as many modules as you want and they can exist within sub directories.

The entry point for each section is not actually a module in the fact that it has no `module.exports` to contribute to.  It is simply code that will be executed when the section is required by another section or included from the container html page with the base section.

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

sections > foo > index.js
```javascript
var myValue = require('./module1').foo();

// add this value to the exports to be available when another section requires this section
session.exports.myValue = foo;
```

sections > foo > module.js
```javascript
exports = {
  foo: function() {
    // return a global value that was set in another module using 'global'
    return global.foo;
  }
}
```
