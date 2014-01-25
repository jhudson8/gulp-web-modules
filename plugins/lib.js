//
//  merge all files in the provided directory (or lib) to the base javascript file
//  options:
//    lib: the directory to inspect when retrieving file contents
//
var fileHeader = require('../lib/file-header'),
    fs = require('fs');

module.exports = function(options) {
  options = options || {},
      dir = options.dir || 'lib',
      priority = options.priority;
  return {
    javascriptCompleteBase: function(options, pipeline) {
      var fileNames = fs.readdirSync('./' + dir);
      if (priority) {
        fileNames = orderFiles(fileNames, priority);
      }
      return pipeline.pipe(fileHeader(fileNames.map(function(name) {
        return './' + dir + '/' + name;
      })));
    }
  }
}

function orderFiles(fileNames, priorityOrdering) {
  var used = {},
      rtn = [];

  // add the high priority
  for (var i in priorityOrdering) {
    var fileName = priorityOrdering[i],
        regexp = new RegExp('^' + fileName.replace('*', '.*') + '$');
    for (var j in fileNames) {
      if (fileNames[j].match(regexp)) {
        used[j] = true;
        rtn.push(fileNames[j]);
        break;
      }
    }
  }

  // add all the leftovers
  for (var i in fileNames) {
    var fileName = fileNames[i];
    if (!used[i] && fileName.indexOf('.') !== 0) {
      rtn.push(fileName);
    }
  }

  return rtn;
}
