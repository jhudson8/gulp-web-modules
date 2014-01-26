Exports
===========

module.exports (or simply exports)
-----------
Any [module](./modules) can contribute to `exports` to expose data or functions to be available to other modules.
```javascript
exports = {
  foo: 'bar'
}
```

section.exports
-----------
Any [module](./modules) can contribute to what is exported for it's parent [section](./sections) using `section.exports`.  This value should *never* be replaced with a new value.
```javascript
var value = require('./example').foo;
session.exports = value;
```

global
-----------
Any [module](./modules) can contribute to a special variable called `global`.  When doing so, it will be available to all other modules regardless of what [section](./sections) they are in.

