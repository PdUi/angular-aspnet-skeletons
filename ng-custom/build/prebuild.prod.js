var fs = require('fs');
var path = require('path');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');

var aotSrcDir = path.resolve(__dirname, '../aot/src');
mkdirp(aotSrcDir, (err) => {
    if (err) console.error(err);
    else {
        var srcDir = path.resolve(__dirname, '../src');
        ncp(srcDir, aotSrcDir);

        var tsConfigInput = path.resolve(__dirname, '../config/tsconfig.aot.json');
        var tsConfigOutput = path.resolve(__dirname, '../aot/tsconfig.aot.json');
        ncp(tsConfigInput, tsConfigOutput);

        mkdirp(path.resolve(__dirname, '../aot/dist'), (err) => {
            if (err) console.error(err);
            ncp(path.resolve(__dirname, '../src/index.aot.html'), path.resolve(__dirname, '../aot/dist/index.html'));
        });
    }
});
