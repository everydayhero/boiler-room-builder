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
  filename: bundleName('css', 'main'),
  allChunks: true
})

const uglify = new webpack.optimize.UglifyJsPlugin({
  sourceMap: true
})
const define = new webpack.DefinePlugin({
  'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
})
const loaderOptions = new webpack.LoaderOptionsPlugin({
  options: {
    postcss: [autoprefixer]
  }
})

const plugins = [
  cssExtractor,
  define,
  loaderOptions
].concat(
  !PROD ? [] : [
    uglify
  ]
)

const rules = [
  {
    test: /\.scss$/,
    use: cssExtractor.extract({
      fallbackLoader: 'style-loader',
      loader: [
        {
          loader: 'css-loader'
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'resolve-url-loader'
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    })
  },
  {
    test: /\.css$/,
    use: cssExtractor.extract({
      fallbackLoader: 'style-loader',
      loader: [
        {
          loader: 'css-loader'
        },
        {
          loader: 'postcss-loader'
        }
      ]
    })
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
  module: { rules },
  devtool: PROD ? 'source-map' : 'eval-source-map',
  plugins
}
