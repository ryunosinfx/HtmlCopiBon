//↓↓↓↓追加
const path = require('path');
const webpack = require("webpack");
module.exports = {
  //  context: __dirname,
  entry: [
    './index.js', './index.css'
  ],
  output: {
    // 出力するファイル名
    filename: 'bundle.js',
    // 出力先のパス
    path: __dirname + "/dist",
    //publicPath: __dirname + "/dist/js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    publicPath: "/dist/",
    contentBase: __dirname + "/dist/",
    watchContentBase: true,
    // inline: true,
    // //host: '0.0.0.0',
    port: 8082,
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/, // may apply this only for some modules
      options: {
        html: './index.html'
      }
    })

    //new webpack.optimize.UglifyJsPlugin(),
    //new webpack.optimize.AggressiveMergingPlugin(),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  }
};
