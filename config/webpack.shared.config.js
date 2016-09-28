const extentions = require('./extensions')
const babelConfig = require('./babel')

const extensionTest = (exts, omitable) => (
  new RegExp(`.(${exts.join('|')})$`)
)

const fileLoaderTest = extensionTest(
  [].concat(
    extentions['audio'],
    extentions['fonts'],
    extentions['images'],
    extentions['video']
  )
)

const babelQuery = `presets[]=${babelConfig.presets.join('&presets[]=')}`

const loaders = [
  {
    test: /\.json$/,
    loader: 'json'
  },
  {
    test: /\.(js|jsx)?$/,
    loader: `babel?${babelQuery}!standard`,
    exclude: /node_modules/
  },
  {
    test: fileLoaderTest,
    loader: 'file'
  }
]

const plugins = []

module.exports = {
  stats: { children: false },
  module: { loaders },
  plugins
}
