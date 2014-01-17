var fs = require('fs'),
    sectionBuilder = require('./section-builder'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber');

module.exports = function(options) {
    var files = fs.readdirSync('./sections'),
        filePrefix = './sections';

    // assume any directory under "sections" is to be packaged up as a section
    for (var i=0; i<files.length; i++) {
        var fileName = files[i],
            filePath = filePrefix + '/' + fileName;
        if (fs.lstatSync('./sections/' + files[i]).isDirectory()) {
            // listen for any file change in the section to trigger a complete section rebuild
            if (options.watch) {
                function callback(fileName, filePath) {
                    return function() {
                        sectionBuilder(fileName, filePath, options);
                    }
                }
                gulp.src(['sections/' + fileName + '/**/*'])
                    .pipe(watch(callback(fileName, filePath))).pipe(plumber());
            } else {
              sectionBuilder(fileName, filePath, options);
            }
        }
    }

    // handle the special "public" directory
    var rtn = gulp.src(['public/**/*'])
    if (options.watch) {
        rtn = rtn.pipe(watch()).pipe(plumber());
    }
    rtn.pipe(gulp.dest(options.buildPath));
}
