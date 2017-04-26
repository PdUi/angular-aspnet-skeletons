/*
  This works to correct the pathing to the config file.
  For instance if the semantic files were arranged as follows in the directory structure:
  src/
    styles/
      semantic.json
      semantic/
  Without this patch, running `gulp --gulpfile ./src/styles/semantic/gulpfile.js build` as an npm task won't work as it won't properly resolve the path to the semantic.json file.

  The problem is, I'm unaware how to hook this into the install process to have it updated there before install gets invokes.

  Therefore, for the time being, semantic.json needs to exist at the same level as the node_modules/ so the install will honor the autoInstall flag.
 */
var fs = require('fs');
var path = require('path');

var semanticUserConfigFile = path.resolve(__dirname, '../src/styles/semantic/tasks/config/user.js');

fs.readFile(semanticUserConfigFile, 'utf8', (err, data) => {
    if (err) return console.log(err);

    var result = data.replace('userConfig = requireDotFile(\'semantic.json\');', 'userConfig = requireDotFile(\'semantic.json\', __dirname);');
    fs.writeFile(semanticUserConfigFile, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});
