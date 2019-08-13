const merge = require('webpack-merge');

const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: '../dist',
    hot: true,
    port: 8080,
    open: true
  }
})