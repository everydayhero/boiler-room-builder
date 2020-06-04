const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const StaticSitePlugin = require('../../plugins/static-site-plugin')
const appFromStats = require('../app-from-stats')
const persistBuildResult = require('./persist-build-result')
const merge = require('webpack-merge')

const progress = new ProgressBarPlugin()

module.exports = async ({
  serverConfig = {},
  clientConfig,
  asyncConfig
}, callback = () => {}) => {
  const buildConfig = typeof asyncConfig === 'function'
    ? await asyncConfig()
    : asyncConfig

  const config = merge.smart(
    serverConfig,
    buildConfig
  )

  const serverCompiler = webpack(config)

  serverCompiler.apply(progress)

  serverCompiler.run((error, serverStats) => {
    if (error) throw error

    console.log(serverStats.toString({
      chunks: false,
      colors: true
    }))

    const app = require(appFromStats(serverStats))

    if (clientConfig) {
      const clientCompiler = webpack(clientConfig)
      const staticSite = new StaticSitePlugin({ app })

      clientCompiler.apply(progress)
      clientCompiler.apply(staticSite)

      clientCompiler.run((error, clientStats) => {
        if (error) throw error

        console.log(clientStats.toString({
          chunks: false,
          colors: true
        }))
        const { assets } = persistBuildResult({ serverStats, clientStats })
        callback({ app, assets, app_path: appFromStats(serverStats) }) // eslint-disable-line standard/no-callback-literal
      })
    } else {
      callback({ app }) // eslint-disable-line standard/no-callback-literal
    }
  })
}
