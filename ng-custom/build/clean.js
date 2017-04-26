var rimraf = require('rimraf');

var reportError = (err) => { if (err) return console.log(err); }

function clean() {
    rimraf('aot', reportError);
    rimraf('dist', reportError);
    rimraf('semantic/dist', reportError);
}

clean();

module.exports = {
    clean: clean
};
