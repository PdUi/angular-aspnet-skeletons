import rollup from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'
import hash from 'rollup-plugin-hash';

export default {
  entry: './aot/src/main.aot.js',
  dest: './aot/dist/build.js',
  sourceMap: true,
  format: 'iife',
  onwarn: function (warning) {
    // should intercept ... but doesn't in some rollup versions
    if (warning.code === 'THIS_IS_UNDEFINED') { return; }

    // console.warn everything else
    console.warn(warning.message);
  },
  plugins: [
    hash({
      algorithm: 'sha256',
      dest: './aot/dist/build.[hash].js',
      replace: true
    }),
    nodeResolve({ jsnext: true, module: true }),
    commonjs({
      include: 'node_modules/rxjs/**',
    }),
    uglify()
  ],
  external: [],
  globals: []
}