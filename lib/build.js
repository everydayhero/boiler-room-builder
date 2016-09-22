const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const StaticSitePlugin = require('../plugins/static-site-plugin')
const appFromStats = require('./app-from-stats')

const progress = new ProgressBarPlugin()

module.exports = ({
  serverConfig = {},
  clientConfig = {}
}, callback = () => {}) => {
  const serverCompiler = webpack(serverConfig)

  serverCompiler.apply(progress)

  serverCompiler.run((error, serverStats) => {
    if (error) throw error

    console.log(serverStats.toString({
      chunks: false,
      colors: true
    }))

    const app = appFromStats(serverStats)

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

        callback({ serverStats, clientStats, app })
      })
    } else {
      callback({ serverStats, app })
    }
  })
}
