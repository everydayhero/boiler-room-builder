const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const {
  loaders,
  plugins,
  context,
  stats,
  publicPath
} = require('./webpack.shared.config')

const {
  OUTPUT_DIR,
  SERVER_ENTRIES
} = require('./constants')

const progress = new ProgressBarPlugin({ clear: true })
const serverPlugins = [progress]

const externals = [nodeExternals()]

module.exports = {
  context,
  stats,
  entry: SERVER_ENTRIES,
  target: 'node',
  externals,
  output: {
    libraryTarget: 'commonjs',
    path: OUTPUT_DIR,
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
        loader: 'null'
      }
    ])
  },
  plugins: plugins.concat(serverPlugins)
}
