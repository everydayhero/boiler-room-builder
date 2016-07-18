const build = require('./build')
const { join } = require('path')
const {
  serve = false,
  serverConfig: serverConfigPath,
  clientConfig: clientConfigPath,
  devConfig: devConfigPath
} = require('yargs').argv

const clientConfig = clientConfigPath
  ? require(join(process.cwd(), clientConfigPath))
  : require('./webpack.client.config')
const serverConfig = serverConfigPath
  ? require(join(process.cwd(), serverConfigPath))
  : require('./webpack.server.config')
const devConfig = devConfigPath
  ? require(join(process.cwd(), devConfigPath))
  : require('./webpack.dev.config')

const { assign } = Object

build(clientConfig, ({ compilation }) => {
  const { assets } = compilation
  build(assign({}, serverConfig, { clientAssets: assets }), () => {
    if (serve) {
      const {
        app,
        renderDocument
      } = require(
        join(serverConfig.output.path, serverConfig.output.filename)
      ).default(assets)

      if (process.env.NODE_ENV === 'production') {
        require('./prod-server')(clientConfig.output.path, app)
      } else {
        require('./generate-index')(clientConfig.output.path, renderDocument)
        require('./dev-server')(clientConfig, devConfig)
      }
    }
  })
})

