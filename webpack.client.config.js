const { join } = require('path')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const {
  PROD,
  CLIENT_ENTRIES,
  OUTPUT_DIR,
  ASSETS_PATH
} = require('./constants')

const {
  loaders,
  plugins,
  context,
  stats,
  publicPath
} = require('./webpack.shared.config')

const bundleName = (ext, name) => (
  PROD
    ? `${name || '[name]'}-[hash].${ext}`
    : `${name || '[name]'}.${ext}`
)

const cssExtractor = new ExtractTextPlugin(
  bundleName('css', 'main'),
  { allChunks: true }
)

const define = new webpack.DefinePlugin({
  'process.env.NODE_ENV': `'${process.env.NODE_ENV || 'development'}'`,
  'process.env.BASE_PATH': `'${process.env.BASE_PATH || ''}'`
})

const uglify = new webpack.optimize.UglifyJsPlugin()
const progress = new ProgressBarPlugin({ clear: true })

const clientPlugins = [
  define,
  cssExtractor,
  progress
].concat(
  !PROD ? [] : [
    uglify
  ]
)

const clientLoaders = [
  {
    test: /\.scss$/,
    loader: cssExtractor.extract(
      'style',
      'css!sass!postcss'
    )
  },
  {
    test: /\.css$/,
    loader: cssExtractor.extract(
      'style',
      'css?module!postcss'
    )
  }
]

const entry = (
  PROD ? [] : [
    'webpack-dev-server/client?http://localhost:8080/'
  ]
).concat(CLIENT_ENTRIES)

module.exports = {
  stats,
  context,
  entry,
  node: { fs: 'empty' },
  output: {
    path: join(OUTPUT_DIR, ASSETS_PATH),
    filename: bundleName('js', 'main'),
    publicPath
  },
  module: { loaders: loaders.concat(clientLoaders) },
  plugins: clientPlugins.concat(plugins),
  postcss () { return [autoprefixer] }
}
