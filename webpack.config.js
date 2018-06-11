//↓↓↓↓追加
const path = require('path');
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  //  context: __dirname,
  entry: {
    bundle: './src/main.js',
    worker: './src/worker.js'
  },
  // [
  //   './src/main.js','./src/worker.js', './index.css'
  // ],
  output: {
    // 出力するファイル名
    filename: '[name].js',
    // 出力先のパス
    path: __dirname + "/dest",
    //publicPath: __dirname + "/dest/js",
    webassemblyModuleFilename: "[modulehash].wasm",
    publicPath: "/dest/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?importLoaders=1&camelCase"

      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader'
          }
        ]
      }, {
        test: /\.wasm$/,
        type: "webassembly/experimental"
      }
    ]
  },
  devServer: {
    publicPath: "/dest/",
    contentBase: __dirname + "/dest/",
    watchContentBase: true,
    // inline: true,
    // host: '0.0.0.0',
    port: 8082
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/,  may apply this only for some modules
      options: {
        html: './index.html'
      }
    }),
    new CopyWebpackPlugin([
      {
        from: './wasm/*.wasm',
        to: './'
      }
    ], { debug: 'debug' })
    //new webpack.optimize.UglifyJsPlugin(),
    //new webpack.optimize.AggressiveMergingPlugin(),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  }
};
