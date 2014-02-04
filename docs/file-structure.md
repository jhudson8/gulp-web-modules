File Structure
==============

Using example file structure below:
```
  build
  |-- ...
  dev
  |-- mocks
      |-- foo.json
  public
  |-- index.html
  sections
  |-- base
  |   |-- index.js
  |-- foo
      |-- index.js
      |-- another-module.js
```

config
------
When building, the `type` command line parameter can be used to specify the build type.  By default, it is `dev` for build / watch tasks and `production` for the `package` task.  A special value referenced by `global.config` will represent the json structure identified by config > {build type}.json.

Example config > dev.json
```json
{"message": "hello"}
```
Usage
```javascript
alert(global.config.message);
```

build
-----
When the application is compled from the source artifacts to the browserified post-build state, those artifacts will be in the build directory.  The dev server will actually serve out resources from this directory.

dev
-----
If the mock server is enabled, it will serve out mock files from `dev > mocks`.  See the [mock server docs](./dev-server/mocks.md) for more details.

public
------
Any resource within this directory will be recursively copied to the root of the build directory.

sections
-------
See [section](./sections.md) documentation.
