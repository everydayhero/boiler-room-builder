const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const PROD = process.env.NODE_ENV === 'production'

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
const define = new webpack.DefinePlugin({
  'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
})

const plugins = [
  cssExtractor,
  define
].concat(
  !PROD ? [] : [
    uglify
  ]
)

const loaders = [
  {
    test: /\.(scss|sass)$/,
    loader: cssExtractor.extract(
      'style',
      'css!postcss!resolve-url!sass?sourceMap'
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
  main: './client.js'
}

module.exports = {
  entry,
  node: { fs: 'empty' },
  output: {
    filename: bundleName('js')
  },
  module: { loaders },
  devtool: PROD ? 'source-map' : 'eval-source-map',
  plugins,
  postcss () { return [autoprefixer] }
}
