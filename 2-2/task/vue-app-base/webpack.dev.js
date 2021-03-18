const common = require('./webpack.common.js')
const webpack = require("webpack");
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode:'development',
  devtool: "source-map",
  devServer: {
    // 添加hot属性
    hot: true,

    contentBase: "./public",
  },
  plugins:[
    new CleanWebpackPlugin(),
    // 添加HMR的插件
    new webpack.HotModuleReplacementPlugin(),
  ]
})