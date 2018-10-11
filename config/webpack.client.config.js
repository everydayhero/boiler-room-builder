const MinisCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

const PROD = process.env.NODE_ENV === 'production'

const bundleName = (ext, name) => (
  PROD
    ? `${name || '[name]'}-[hash].${ext}`
    : `${name || '[name]'}.${ext}`
)

const plugins = [
  new MinisCssExtractPlugin({
    filename: bundleName('css')
  })
]

const rules = [
  {
    test: /\.css$/,
    use: [
      MinisCssExtractPlugin.loader,
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
  plugins,
  mode: PROD ? 'production' : 'development'
}
