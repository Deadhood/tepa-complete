const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const SRC_DIR = path.resolve(__dirname, 'src')
const OUTPUT_DIR = path.resolve(__dirname, 'public', 'static')

const isProd = process.env.NODE_ENV === 'production'

const webpackConfig = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    path.join(SRC_DIR, 'index.js')
  ],
  output: {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'resolve-url-loader', 'sass-loader']
        })
      },
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
        exclude: isProd ? void 0 : /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: 'img/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: 'font/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(jade|pug)$/,
        use: [{ loader: 'pug-loader' }],
        exclude: /node_modules/
      }
    ]
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        isProd ? 'production' : 'development'
      )
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: !isProd
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HTMLWebpackPlugin({
      title: 'React App',
      template: 'views/admin.pug'
    })
  ],
  devtool: 'cheap-inline-source-map',
  stats: 'minimal',
  devServer: {
    host: 'localhost',
    port: 9000,
    hot: true
  }
}

if (isProd) {
  webpackConfig.devtool = 'source-map'
  webpackConfig.entry.splice(0, 3)
  webpackConfig.plugins.splice(
    2,
    2,
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      debug: false
    }),
    new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = webpackConfig
