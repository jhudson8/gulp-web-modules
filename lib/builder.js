var fs = require('fs'),
    sectionBuilder = require('./section-builder'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    gulpIf = require("gulp-if");

module.exports = function (options) {
    var sectionDirs = fs.readdirSync('./sections'),
        filePrefix = './sections';

    // assume any directory under "sections" is to be packaged up as a section
    for (var i = 0; i < sectionDirs.length; i++) {
        var sectionName = sectionDirs[i],
            filePath = filePrefix + '/' + sectionName;
        function callback(sectionName, filePath, options) {
            return function() {
                return sectionBuilder(sectionName, filePath, options);
            }
        }
        if (options.watch) {
            gulp.src([filePath + '/**/*'])
                .pipe(watch(callback(sectionName, filePath, options)))
        } else {
            callback(sectionName, filePath, options)();
        }
    }

    // handle the special "public" directory
    gulp.src(['public/**/*'])
        .pipe(gulpIf(options.watch, watch()))
        // .pipe(options.onPublicResource())
        .pipe(gulp.dest(options.buildPath));
}
