const compile = require('./compile')
const configs = require('./configs')
const assetsFromStats = require('./assets-from-stats')

const PROD = process.env.NODE_ENV === 'production'

const prodServer = require('./prod-server')
const devServer = require('./dev-server')

module.exports = ({
  port,
  sharedConfigPath,
  serverConfigPath,
  clientConfigPath,
  devConfigPath,
  inputDir,
  outputDir,
  basePath
}) => {
  const {
    serverConfig,
    clientConfig,
    devConfig
  } = configs({
    inputDir,
    outputDir,
    basePath,
    sharedConfigPath,
    serverConfigPath,
    clientConfigPath,
    devConfigPath
  })

  if (PROD) {
    compile({ serverConfig, clientConfig }, ({ clientStats, app }) => {
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
    compile({ serverConfig }, ({ app }) => {
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
