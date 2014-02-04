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

The exports index.js module for each section will be provided as the callback parameter when another section is loaded asynchronously.
For example, in section *foo*
    // sections/foo/index.html
    module.exports.abc = 'def';

And if I were to require *foo* from another section, I would have access to the *abc* attribute
    // sections/bar/index.js
    require('bar', function(barExports) {
      alert('abc is ' + barExports.abc);
    });


global
-----------
Any [module](./modules) can contribute to a special variable called `global`.  When doing so, it will be available to all other modules regardless of what [section](./sections) they are in.

