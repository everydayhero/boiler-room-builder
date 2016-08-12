const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const PROD = process.env.NODE_ENV === 'production'
const PORT = process.env.BRB_PORT || 8080

const bundleName = (ext, name) => (
  PROD
    ? `${name || '[name]'}-[hash].${ext}`
    : `${name || '[name]'}.${ext}`
)

const cssExtractor = new ExtractTextPlugin(
  bundleName('css', 'main'),
  { allChunks: true }
)

const uglify = new webpack.optimize.UglifyJsPlugin()

const plugins = [
  cssExtractor
].concat(
  !PROD ? [] : [
    uglify
  ]
)

const loaders = [
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
      'css!postcss'
    )
  }
]

const entry = {
  main: (
    PROD
      ? []
      : [`webpack-dev-server/client?http://0.0.0.0:${PORT}`]
  ).concat('./client.js')
}

module.exports = {
  entry,
  node: { fs: 'empty' },
  output: {
    filename: bundleName('js')
  },
  module: { loaders },
  plugins,
  postcss () { return [autoprefixer] }
}
