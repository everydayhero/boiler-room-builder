const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const PROD = process.env.NODE_ENV === 'production'

const bundleName = (ext, name) => (
  PROD
    ? `${name || '[name]'}-[hash].${ext}`
    : `${name || '[name]'}.${ext}`
)

const cssExtractor = new ExtractTextPlugin({
  filename: bundleName('css'),
  allChunks: true
})

const uglify = new webpack.optimize.UglifyJsPlugin({
  sourceMap: true
})
const define = new webpack.DefinePlugin({
  'process.env.NODE_ENV': `'${process.env.NODE_ENV || ''}'`
})

const plugins = [
  cssExtractor,
  define
].concat(
  !PROD ? [] : [
    uglify
  ]
)

const rules = [
  {
    test: /\.css$/,
    use: cssExtractor.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer()
            ]
          }
        }
      ]
    })
  }
]

const entry = {
  main: './client'
}

module.exports = {
  entry,
  node: { fs: 'empty' },
  output: {
    filename: bundleName('js')
  },
  module: { rules },
  devtool: PROD ? 'source-map' : 'eval-source-map',
  plugins
}
