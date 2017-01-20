const extensions = require('./extensions')
const babelConfig = require('./babel')

const extensionTest = (exts, omitable) => (
  new RegExp(`.(${exts.join('|')})$`)
)

const fileLoaderTest = extensionTest(
  [].concat(
    extensions['audio'],
    extensions['fonts'],
    extensions['images'],
    extensions['video']
  )
)

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
    exclude: /node_modules/
  },
  {
    test: fileLoaderTest,
    use: 'file-loader'
  }
]

const plugins = []

module.exports = {
  stats: { children: false },
  module: { rules },
  plugins
}
