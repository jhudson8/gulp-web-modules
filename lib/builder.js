var fs = require('fs'),
    moduleBuilder = require('./module-builder'),
    gulp = require('gulp'),
    watch = require('gulp-watch');

module.exports = function(options) {
    var files = fs.readdirSync('./modules'),
        filePrefix = './modules';

    // assume any directory under "modules" is to be packaged up as a module
    for (var i=0; i<files.length; i++) {
        var fileName = files[i],
            filePath = filePrefix + '/' + fileName;
        if (fs.lstatSync('./modules/' + files[i]).isDirectory()) {
            moduleBuilder(fileName, filePath, options);

            // listen for any file change in the module to trigger a module rebuild
            if (options.watch) {
                function callback(fileName, filePath) {
                    return function() {
                        moduleBuilder(fileName, filePath, options);
                    }
                }
                gulp.src(['modules/' + fileName + '/**/*'])
                    .pipe(watch(callback(fileName, filePath)));
            }
        }
    }

    // handle the special "public" directory
    var rtn = gulp.src(['public/*'])
    if (options.watch) {
        rtn = rtn.pipe(watch());
    }
    rtn.pipe(gulp.dest(options.buildPath));
}
