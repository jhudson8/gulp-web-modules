var fs = require('fs'),
    wrapper = require('./wrapper'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    filter = require('gulp-filter'),
    path = require("path"),
    map = require("map-stream"),
    gulpIf = require("gulp-if"),ƒ
    watch = require("gulp-watch"),
    header = require("gulp-header"),
    footer = require("gulp-footer"),
    es = require("event-stream");

var fileHeaderPlugin = function(files) {
  return es.map(function(file, cb) {
    var fileContents = [];
    function callback(index) {
        return function(err, data) {
            if (err) {
                console.err(err);
            }
            else if (data) {
                fileContents.push(data);
            }

            index++;
            var path = files[index];
            if (path) {
                fs.readFile(path, callback(index));
            } else {
                fileContents.push(file.contents);
                file.contents = Buffer.concat(fileContents);
                cb(null, file);
            }
        }
    }
    callback(-1)();
  });
};

module.exports = function (dirName, dirPath, options) {
    console.log('building module: ' + dirName);

    var primarySection = (dirName === options.primarySection),
        buildType = options.buildType,
        plugins = options.normalizedPlugins,
        onSectionPreBrowserify = plugins.onSectionPreBrowserify,
        onSectionPostBrowserify = plugins.onSectionPostBrowserify,
        onSectionPreDest = plugins.onSectionPreDest;

    function applyWrapperContent(pipeline) {
        var pipeline = pipeline.pipe(header('\nfunction requireSection (name, callback) { var names = Array.isArray(name) ? name : [name]; for (var i=0; i<names.length; i++) { names[i] = \'sections/\' + names[i]; }\nrequire(names, callback); }\n'));

        if (primarySection) {
            var configFileName = './config/' + buildType + '.json';
            if (fs.existsSync(configFileName)) {
                pipeline = pipeline.pipe(fileHeaderPlugin([configFileName])).pipe(header('self.config = '));
            }
            pipeline = pipeline.pipe(header('if (typeof self === \'undefined\') { var self = {}; }\n'));
        } else {
            pipeline = pipeline.pipe(header('define(function() { var sectionExports = {};\n'));
        }

        if (primarySection) {
            // add all global files in "lib" directory
            if (fs.existsSync('./lib')) {
                pipeline = pipeline.pipe(fileHeaderPlugin(fs.readdirSync('./lib').map(function(part) { return './lib/' + part } )));
            }
        } else {
            pipeline = pipeline.pipe(footer('\nreturn sectionExports; });'));
        }
        return pipeline;
    }

    function renameModuleFilesToBuild() {
        function rename(file, callback) {
            var relativePath = path.relative(file.cwd, file.path),
                buildFileName = options.buildPath + '/' + relativePath;
            file.path = path.join(file.cwd, buildFileName);
            var parts = file.path.split('/');
            parts.pop();
            file.base = parts.join('/') + '/';
            callback(null, file);
        }
        return map(rename);
    }


    var pipeline = gulp.src([dirPath + '/**/*']);
    if (onSectionPreBrowserify) {
        pipeline = pipeline.pipe(onSectionPreBrowserify.tail);
        // pipeline = onSectionPreBrowserify.tail;
        // we need to write the updated contents to disk so browserify will recognize them
        pipeline = pipeline.pipe(gulp.dest(options.buildPath + '/sections/' + dirName))
    }
    pipeline = pipeline.pipe(renameModuleFilesToBuild())
        .pipe(filter(function (file) {
                return file.path.match(/\/main.js/)
            }))
        .pipe(browserify());
    if (onSectionPostBrowserify) {
        pipeline.pipe(onSectionPostBrowserify.head);
        pipeline = onSectionPostBrowserify.tail;
    }
    applyWrapperContent(pipeline)
        .pipe(rename(dirName + '.js'))
        .pipe(gulp.dest(options.buildPath + '/sections'));
}

