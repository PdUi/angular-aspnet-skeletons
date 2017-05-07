const helpers = require('./helpers');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const { BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');

// the order of these entry points is important, do not rearrange
const entryPoints = [
  'polyfills',
  'vendor',
  'main',
  'vendor-styles'
];

module.exports = {
  // output: {
  //   publicPath: '/'
  // },
  entry: {
    main: ['./src/main.ts'],
    polyfills: ['./src/polyfills.ts'],
    vendor: ['./src/vendor.ts'],
    'vendor-styles': ['./src/styles/semantic/dist/semantic.min.css']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader?{configFileName:\'config/tsconfig.dev.json\'}',
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
    new BaseHrefWebpackPlugin({}),
    new ProgressPlugin(),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, // The (\\|\/) piece accounts for path separators in *nix and Windows
      helpers.root('src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => module.resource && module.resource.startsWith(helpers.root('node_modules')),
      chunks: ['main']
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
  devServer: {
    compress: true,
    contentBase: './dist/',
    historyApiFallback: true,
    stats: 'minimal'
  },
  node: {
    fs: 'empty',
    global: true,
    crypto: 'empty',
    tls: 'empty',
    net: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
