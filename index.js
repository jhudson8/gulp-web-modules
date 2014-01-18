var builder = require('./lib/builder'),
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    through = require("through2"),
    server = require("./lib/server");

function checkOptions(options, mergeOptions) {
    options = options || {};
    var nop = function() {
            return through(function(data) {
                    this.emit('data', data);
            });
        },
        _defaults = {
        entry: 'main.js',
        primarySection: 'base',
        buildPath: 'build',
        defaultServResource: 'index.html',
        port: 8080,
        proxy: function(gulpOptions, requestOptions, callback) {
            callback();
        },
        onSectionPreBrowserify: nop,
        onSectionPostBrowserify: nop,
        onSectionPreDest: nop,
        onPublicResource: nop
    }
    for (var i in _defaults) {
        if (options[i] === undefined) {
            options[i] = _defaults[i];
        }
    }
    if (!_defaults.entry.match(/.*\.js/)) {
        _defaults.entry += '.js';
    }
    if (mergeOptions) {
        var rtn = {};
        for (var name in options) {
            rtn[name] = options[name];
        }
        for (var name in mergeOptions) {
            rtn[name] = mergeOptions[name];
        }
        return rtn;
    }
    console.log(JSON.stringify(options));
    return options;
}

function _clean(src) {
    gulp.src(src, {read: false}).pipe(clean());
}

module.exports = function(options) {
    options = checkOptions(options);

    return {
        injectTasks: function(gulp, tasks) {
            if (!tasks) {
                tasks = [];
                for (var i in this) {
                    if (i != 'injectTasks') {
                        tasks.push(i);
                    }
                }
            }

            for (var i in tasks) {
                var task = tasks[i];
                if (this[task]) {
                    gulp.task(task, this[task]);
                } else {
                    throw "invalid gulp-web-module task '" + task + "'";
                }
            }
        },

        build: function() {
            builder(checkOptions(options, {buildType: gulp.env.type || 'dev'}));
        },

        watch: function() {
            builder(checkOptions(options, checkOptions(options, {buildType: gulp.env.type || 'dev', watch: true})));
        },

        watchrun: function() {
            builder(checkOptions(options, checkOptions(options, {buildType: gulp.env.type || 'dev', watch: true})));
            server.start(options);
        },

        clean: function() {
            _clean(options.buildPath);
        }
    }
}
