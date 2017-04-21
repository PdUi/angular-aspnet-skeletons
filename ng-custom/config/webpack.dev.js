const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

module.exports = webpackMerge(commonConfig, {
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    path: helpers.root('./dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});