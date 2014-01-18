var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

function respondWithFile(req, res, filename) {
    fs.exists(filename, function (exists) {
        if (!exists) {
            console.log("Invalid Request (404): " + filename);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.write('404 Not Found\n');
            res.end();
            return;
        }
        console.log('response: ' + filename);

        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        res.writeHead(200, mimeType);

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);

    });
}

module.exports = {
    start: function (options) {
        http.createServer(function (req, res) {
            var uri = url.parse(req.url).pathname;

            var proxy = options.proxy({
                request: req,
                response: res,
                uri: uri,
                base: './' + options.buildPath
            }, options, function (proxy) {
                proxy = proxy || {};
                if (!proxy || !proxy.terminate) {
                    // the proxy has not responded
                    var fileName = proxy.fileName;
                    if (!fileName) {
                        if (uri === '/') {
                            uri = options.defaultServResource;
                        }
                        filename = path.join(process.cwd(), options.buildPath, uri);
                        respondWithFile(req, res, filename);
                    }
                }
            });
        }).listen(options.port);
    }
}
