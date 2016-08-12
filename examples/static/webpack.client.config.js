const defaultConfig = require('../../webpack.client.config')
const { DefinePlugin } = require('webpack')
const { assign } = Object

const { plugins: defaultPlugins = [] } = defaultConfig

module.exports = assign({}, defaultConfig, {
  plugins: defaultPlugins.concat([
    new DefinePlugin({
      'process.env.BASE_PATH': `'${process.env.BASE_PATH || ''}'`
    })
  ])
})

