const build = require('./build')
const { join } = require('path')
const { writeFile } = require('fs')

const PROD = process.env.NODE_ENV === 'production'

const prodServer = require('./prod-server')
const devServer = require('./dev-server')

module.exports = ({
  renderIndexFile,
  serverConfig,
  clientConfig,
  devConfig
}) => {
  build({ serverConfig, clientConfig }, ({ serverCompilation, clientCompilation }) => {
    const { assets: clientAssets, outputOptions: clientOutput } = clientCompilation
    const { outputOptions: serverOutput } = serverCompilation
    const { path, filename } = serverOutput
    const appModule = require(join(path, filename))
    const initApp = appModule.default || appModule

    const assets = Object.keys(clientAssets).map((asset) => (
      clientOutput.publicPath + asset
    ))

    initApp({ assets }).then((app) => {
      if (PROD) {
        prodServer({
          staticDir: clientOutput.path,
          app
        })
      } else {
        const indexContent = app.empty()

        writeFile(join(clientOutput.path, 'index.html'), indexContent, () => {
          devServer({
            clientConfig,
            devConfig
          })
        })
      }
    })
  })
}
