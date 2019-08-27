const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports ={
  mode: 'production',
  devtool: 'cheap-module-source-map',
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({})
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    chunkFilename: '[name].[contentHash].js',
    filename: '[name].[contentHash].js'
  }
}