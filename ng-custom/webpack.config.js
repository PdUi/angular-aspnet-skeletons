var path = require('path');
var _root = path.resolve(__dirname, '..');
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const entryPoints = ['polyfills', 'vendor', 'main'];

module.exports = {
  entry: {
      main: [
          './src/main.ts'
      ],
      polyfills: [
          './src/polyfills.ts'
      ],
      vendor: [
          './src/vendor.ts'
      ]
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    path: root('./dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
            'awesome-typescript-loader',
            'angular2-template-loader'
        ],
        exclude: /\/node_modules\//
      },
      {
        test: /\.ts$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      root('./src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['main', 'vendor', 'polyfills']
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    }),
    new HtmlWebpackPlugin({
      template: './src\\index.html',
      filename: './index.html',
      hash: false,
      inject: true,
      compile: true,
      favicon: false,
      minify: false,
      cache: true,
      showErrors: true,
      chunks: 'all',
      excludeChunks: [],
      xhtml: true,
      chunksSortMode: function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
          return 1;
        }
        else if (leftIndex < rightindex) {
          return -1;
        }
        else {
          return 0;
        }
      }
    })
  ],
  resolve: {
    extensions: [
        '.ts',
        '.js'
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
};