const defaultConfig = require('../../webpack.server.config')
const StaticSitePlugin = require('../../static-site-plugin')
const { assign } = Object

const { plugins: defaultPlugins = [] } = defaultConfig

module.exports = assign({}, defaultConfig, {
  plugins: defaultPlugins.concat([
    new StaticSitePlugin()
  ])
})

