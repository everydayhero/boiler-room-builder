const defaultConfig = require('../../webpack.server.config')
const StaticSitePlugin = require('../../static-site-plugin')
const { assign } = Object

module.exports = assign({}, defaultConfig, {
  plugins: defaultConfig.plugins.concat([
    new StaticSitePlugin()
  ])
})

