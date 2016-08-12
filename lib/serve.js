const build = require('./build')
const { join } = require('path')

const PROD = process.env.NODE_ENV === 'production'

const prodServer = require('./prod-server')
const devServer = require('./dev-server')

module.exports = ({
  port,
  serverConfig,
  clientConfig,
  devConfig
}) => {
  if (PROD) {
    build({ serverConfig, clientConfig }, ({ serverCompilation, clientCompilation }) => {
      const { assets: clientAssets, outputOptions: clientOutput } = clientCompilation
      const { outputOptions: serverOutput } = serverCompilation
      const { path, filename } = serverOutput
      const appModule = require(join(path, filename))
      const initApp = appModule.default || appModule

      const assets = Object.keys(clientAssets).map((asset) => (
        clientOutput.publicPath + asset
      ))

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
