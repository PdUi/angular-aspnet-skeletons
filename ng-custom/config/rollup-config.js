import rollup from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'
import hash from 'rollup-plugin-hash';

import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

export default {
  entry: './aot/src/main.aot.js',
  dest: './aot/dist/build.js',
  sourceMap: true,
  format: 'iife',
  onwarn: function (warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') { return; }
    console.warn(warning.message);
  },
  plugins: [
    postcss({
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false }),
        cssnano(),
      ],
      extensions: [ '.css' ]
    }),
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