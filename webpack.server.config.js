const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const {
  loaders,
  plugins,
  context,
  stats,
  publicPath
} = require('./webpack.shared.config')

const {
  SERVER_OUTPUT_DIR,
  SERVER_ENTRIES
} = require('./constants')

const progress = new ProgressBarPlugin({ clear: true })
const serverPlugins = [
  progress
]

module.exports = {
  context,
  stats,
  entry: SERVER_ENTRIES,
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: SERVER_OUTPUT_DIR,
    filename: 'server.js',
    publicPath
  },
  module: {
    loaders: loaders.concat([
      {
        test: /\.scss$/,
        loader: 'null'
      },
      {
        test: /\.css$/,
        loader: 'css-loader/locals?module'
      }
    ])
  },
  plugins: plugins.concat(serverPlugins)
}
