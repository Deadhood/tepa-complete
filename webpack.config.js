const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const SRC_DIR = path.resolve(__dirname, 'src')
const OUTPUT_DIR = path.resolve(__dirname, 'public', 'static')

const isProd = process.env.NODE_ENV === 'production'

const extractSass = new ExtractTextPlugin({
  filename: 'bundle.css',
  disable: !isProd
})

const webpackConfig = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
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
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            { loader: 'resolve-url-loader' },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [SRC_DIR]
              }
            }
          ]
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
    extractSass,
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
  webpackConfig.entry.splice(0, 3, 'core-js')
  webpackConfig.plugins.splice(
    1,
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
