const merge = require('webpack-merge');
const path = require('path');

const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: '../dist',
    hot: true,
    port: 8080,
    open: true
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    chunkFilename: '[name].js',
    filename: '[name].js'
  }
})