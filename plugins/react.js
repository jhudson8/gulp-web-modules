//
//  Compile all .jsx files to javascript
//
module.exports = function(React, options) {
  options = options || {};
  return {
    javascriptGlob: '**/*.jsx',
    beforeBrowserify: function(options, pipeline) {
      return pipeline.pipe(React(options));
    }
  }
}
