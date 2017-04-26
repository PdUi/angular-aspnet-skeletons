var fs = require('fs');
var path = require('path');
var ncp = require('ncp').ncp;

var aotDistDir = path.resolve(__dirname, '../aot', 'dist');
var aotSrcDir = path.resolve(__dirname, '../aot', 'src');
var nodeModulesDir = path.resolve(__dirname, '../node_modules');
var semanticDir = path.resolve(__dirname, '../src/styles/semantic/dist');
var distDir = path.resolve(__dirname, '../dist');

copyFiles(performFileUpdatesForHash);

function copyFiles (callback) {
    ncp(aotDistDir, distDir, (err) => {
        if (err) return console.log(err);

        var filesToCopy = [
            { input: path.resolve(nodeModulesDir, 'core-js/client/shim.min.js'), output: path.resolve(distDir, 'shim.min.js') },
            { input: path.resolve(nodeModulesDir, 'zone.js/dist/zone.min.js'), output: path.resolve(distDir, 'zone.min.js') },
            { input: path.resolve(semanticDir, 'semantic.min.css'), output: path.resolve(distDir, 'semantic.min.css') }
        ];

        filesToCopy.forEach(fileToCopy => ncp(fileToCopy.input, fileToCopy.output));
        callback();
    });
}

function updateFileWithHash(fileName, hash) {
    var fullMapFileName = fileName + '.js.map';
    var fullMapHashFileName = fileName + '.' + hash + '.js.map';

    var fullFileName = fileName + '.js';
    var fullHashFileName = fileName + '.' + hash + '.js';

    var inputFile = path.resolve(distDir, fullMapFileName);
    var outputFile = path.resolve(distDir, fullMapHashFileName);

    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) return console.log(err);

        var result = data.replace('"file":"' + fullFileName + '"', '"file":"' + fullHashFileName + '"');
        fs.writeFile(outputFile, result, 'utf8', function (err) {
            if (err) return console.log(err);

            fs.unlink(inputFile);
        });
    });
}

function updateIndexFile (fileHashes) {
    var indexFileSrc = path.resolve(aotSrcDir, 'index.aot.html');
    var indexFileDest = path.resolve(distDir, 'index.html');
    fs.readFile(indexFileSrc, 'utf8', (err, data) => {
        if (err) return console.log(err);

        var scripts = '';
        fileHashes.forEach(fileHash => {
            var hashedFileName = fileHash.name + '.' + fileHash.hash + '.js';
            scripts += '<script src="' + hashedFileName + '"></script>';
        });

        var result = data.replace(/<\/body>[\s\S]*<\/html>/g, '</body>' + scripts + '</html>');
        fs.writeFile(indexFileDest, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function performFileUpdatesForHash () {
    fs.readdir(distDir, (err, files) => {
        if (err) return console.log(err);

        var fileHashes = [];
        files.forEach(file => {
            if (file.endsWith('.js') && !file.endsWith('.min.js')) {
                var fileName = file.match(/[a-z]+\./g)[0].replace('.', '');
                var fileHash = file.match(/\.[a-z0-9]+\./g)[0].replace(/\./g, '');

                updateFileWithHash(fileName, fileHash);
                fileHashes.push({ name: fileName, hash: fileHash });
            }
        });

        updateIndexFile(fileHashes);
    });
}
