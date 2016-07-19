const build = require('./build')
const { join } = require('path')

const { assign } = Object

module.exports = ({
  serve = false,
  serverConfig,
  clientConfig,
  devConfig
}) => {
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
}
