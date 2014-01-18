var fs = require('fs'),
    sectionBuilder = require('./section-builder'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber');

module.exports = function(options) {
    var sectionDirs = fs.readdirSync('./sections'),
        filePrefix = './sections';

    // assume any directory under "sections" is to be packaged up as a section
    for (var i=0; i<sectionDirs.length; i++) {
        var sectionName = sectionDirs[i],
            filePath = filePrefix + '/' + sectionName;
            sectionBuilder(sectionName, filePath, options)
    }

    // handle the special "public" directory
    var rtn = gulp.src(['public/**/*'])
    if (options.watch) {
        rtn = rtn.pipe(watch()).pipe(plumber());
    }
    rtn = options.onPublicResource(rtn);
    rtn.pipe(gulp.dest(options.buildPath));
}
