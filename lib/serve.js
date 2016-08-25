const build = require('./build')
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
    build({ serverConfig, clientConfig }, ({ clientStats, app }) => {
      const { compilation } = clientStats
      const { outputOptions } = compilation
      const assets = assetsFromStats(clientStats, outputOptions.publicPath)
      const init = app.init || app.default || app

      Promise.resolve({ assets }).then(init).then((run) => {
        prodServer({
          port,
          staticDir: outputDir,
          run
        })
      })
    })
  } else {
    build({ serverConfig }, ({ app }) => {
      devServer({
        app,
        port,
        clientConfig,
        devConfig,
        contentBase: outputDir
      })
    })
  }
}
