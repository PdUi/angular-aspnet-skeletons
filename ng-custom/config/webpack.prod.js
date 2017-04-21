const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');

const { AotPlugin } = require('@ngtools/webpack');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  output: {
    filename: '[name].[chunkhash:20].bundle.js',
    chunkFilename: '[id].[chunkhash:20].chunk.js',
    path: helpers.root('./dist')
  },
  module: {
    rules: [
        {
            exclude: [helpers.root('./semantic/dist/semantic.min.css')],
            test: /\.css$/,
            loaders: [
            'exports-loader?module.exports.toString()',
            'css-loader?{sourceMap:false,importLoaders:1}',
            'postcss-loader'
            ]
        },
        {
            include: [helpers.root('./semantic/dist/semantic.min.css')],
            test: /\.css$/,
            loaders: ExtractTextPlugin.extract({
                use: [
                    'css-loader?{sourceMap:false,importLoaders:1}',
                    'postcss-loader'
                ],
                fallback: 'style-loader',
                publicPath: ''
            })
        }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
        filename: '[name].[chunkhash:20].css',
        disable: false
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'md5',
      hashDigest: 'base64',
      hashDigestLength: 4
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        test: /\.html$/,
        minimize: true
      },
    //   sourceMap: false,
      options: {
        postcss: [
          autoprefixer(),
          postcssUrl({
            url: (URL) => {
              // Only convert root relative URLs, which CSS-Loader won't process into require().
              if (!URL.startsWith('/') || URL.startsWith('//')) {
                return URL;
              }
              if (deployUrl.match(/:\/\//)) {
                // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                return `${deployUrl.replace(/\/$/, '')}${URL}`;
              }
              else if (baseHref.match(/:\/\//)) {
                // If baseHref contains a scheme, include it as is.
                return baseHref.replace(/\/$/, '') +
                  `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
              }
              else {
                // Join together base-href, deploy-url and the original URL.
                // Also dedupe multiple slashes into single ones.
                return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
              }
            }
          }),
          cssnano({ safe: true, autoprefixer: false })
        ],
        context: ''
      }
    }),
    new AotPlugin({
      mainPath: helpers.root('./src/main.ts'),
      hostReplacementPaths: {
        'src\\environments\\environment.ts': 'src\\environments\\environment.prod.ts'
      },
      exclude: [],
      tsConfigPath: helpers.root('./config/tsconfig.aot.json')
    })
  ]
});