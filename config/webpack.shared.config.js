const extensions = require('./extensions')
const babelConfig = require('./babel')

const extensionsFlat = [].concat(
  extensions['audio'],
  extensions['fonts'],
  extensions['images'],
  extensions['video']
)
const fileLoaders = extensionsFlat.map((ext) => ({
  test: new RegExp(`\\.${ext}$`),
  loader: 'file-loader'
}))

const rules = [
  {
    test: /\.(js|jsx)?$/,
    use: [
      {
        loader: 'babel-loader',
        options: babelConfig
      },
      'standard-loader'
    ],
    exclude: /node_modules|dist/
  }
].concat(fileLoaders)

const plugins = []

module.exports = {
  stats: { children: false },
  module: { rules },
  plugins
}
