Dev Server
=================

The dev server is included with this package and can be started using the `run` or `watchrun/runwatch` task.  By default it will serve out your application build resources on port 8080.  If you include an index.html file in your public directory, you simply need to start the server and browse to `http://localhost:8080`.

Configuration
-------------
The following config options can be provided within the `devServer` attribute on the package config.
* defaultServResource: (default "index.html") default file to be served if the "/" uri is requested
* port: (default "8080") http port used for the dev server
* mocks: see "mock server" section for details

Example (gulpfile.js)
------------
```javascript
var gulp = require('gulp')
    modules = require('gulp-web-modules');

var modules = require('gulp-web-modules')({
  devServer: {
    port: 8000,
    mocks: {
      prefix: '/services/'
    },
    plugins: [
      ...
    ]
  }
}).injectTasks(gulp);
```

Plugins
----------
The dev server can be modified with plugins.  The functionality of the dev server is actually all plugin-based.  This can be useful to serve mock files with custom logic or to proxy API requests to another service provider.  See the [existing plugins](https://github.com/jhudson8/gulp-web-modules/tree/master/lib/dev-server) for examples.

A plugin is simply a hash which has a defined function as the `onRequest` attribute (and optionally a `userConfig` attribute).  This is an async function with parameters:
1) requestOptions: hash containing attributes specific to the current request
  * uri: url.parse(req.url).pathname
  * req: [the request object](http://nodejs.org/api/http.html#http_http_incomingmessage)
  * res: [the response object](http://nodejs.org/api/http.html#http_class_http_serverresponse)
2) pluginOptions: `devServer` options provided in `gulpfile.js` (see Configuration section above)
3) callback async callback which *must* be called.  The single paramter can be of the following
  * `undefined`: if this plugin should not handle the requested resource
  * `true`: if the plugin handled the requested resource and no further plugins should be notified of the resource
  * data hash containing the following optional values
    * fileName: (string or Array) single/array of filenames to be served out in order of importance (absolute or relative to the project root)
    * stream: a stream to be piped to the response
    * mimeType: mime type to be applied if a stream is used

Plugins can also contribute to the admin page to allow the user to configure them while the application is running.

Mock Files
------------
The dev server can serve out mock files.  See the [mock file configuration](./mock-server.md) for more details.

Admin Page
-------------
If the dev server is running, you can browse to `http://localhost:8080/$admin` to configure different aspects of the server.  By default, the mock server details can be configured (and other server plugins if applicable).

Each plugin can optionally provide a `userConfig` attribute which allows the user to configure certain attributes that the plugin exposes.  This has the following structure:
* key: a unique key identifying the package which contains no whitespace
* section: display title for the section of content in the admin page
* inputs: array of input values to be accepted;  hash of
  * key: unique key identifying this input
  * label: the display label
  * type: (text is default) the input type (text/boolean)
* store: hash which will be used by the admin page to set input values;  each value will be set on this hash using the defined key from the `inputs` entry.  This value should be defaulted with any options that the plugin initially uses

An example from the mock server is:
```json
    userConfig: {
      key: 'mock-server',
      section: 'Dev Server',
      inputs: [
        {key: 'filePathLocation', label: 'Directory to serve files from'},
        {key: 'urlPrefix', label: 'URL Prefix (to enable mock response)'},
        {key: 'enabled', label: 'Mock Server Enabled', type: 'boolean'},
      ],
      store: config
    }
```

