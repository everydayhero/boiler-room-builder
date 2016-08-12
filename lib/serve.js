const build = require('./build')
const { join } = require('path')
const assetsFromStats = require('./assets-from-stats')

const PROD = process.env.NODE_ENV === 'production'

const prodServer = require('./prod-server')
const devServer = require('./dev-server')

module.exports = ({
  port,
  serverConfig,
  clientConfig,
  devConfig,
  outputDir
}) => {
  if (PROD) {
    build({ serverConfig, clientConfig }, ({ serverStats, clientStats }) => {
      const { compilation: clientCompilation } = clientStats
      const { compilation: serverCompilation } = serverStats

      const { outputOptions: clientOutput } = clientCompilation

      const { outputOptions: serverOutput } = serverCompilation
      const { path, filename } = serverOutput

      const appModule = require(join(path, filename))
      const initApp = appModule.default || appModule

      const assets = assetsFromStats(clientStats, clientOutput.publicPath)

      Promise.resolve({ assets }).then(initApp).then((app) => {
        prodServer({
          port,
          staticDir: clientOutput.path,
          app
        })
      })
    })
  } else {
    devServer({
      port,
      clientConfig,
      devConfig
    })
  }
}
