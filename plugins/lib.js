//
//  merge all files in the provided directory (or lib) to the base javascript file
//  options:
//    lib: the directory to inspect when retrieving file contents
//
var fileHeader = require('../lib/file-header'),
    fs = require('fs');

module.exports = function(options) {
  options = options || {},
      dir = options.dir || 'lib';
  return {
    javascriptCompleteBase: function(options, pipeline) {
      return pipeline.pipe(fileHeader(fs.readdirSync('./' + dir).map(function(name) {
        return './' + dir + '/' + name;
      })));
    }
  }
}
