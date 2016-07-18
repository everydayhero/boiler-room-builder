const argv = require('yargs').argv
const { join } = require('path')
const { SERVER_OUTPUT_DIR } = require('./constants')
const build = require('./build')

const clientConfig = require(join(process.cwd(), 'webpack.client.config'))
const serverConfig = require(join(process.cwd(), 'webpack.server.config'))

const { assign } = Object

build(clientConfig, ({ compilation }) => {
  const { assets } = compilation
  const decoratedServerConfig = assign({}, serverConfig, {
    clientAssets: assets
  })
  build(decoratedServerConfig, () => {
    if (argv.serve) {
      const {
        app,
        renderDocument
      } = require(
        join(SERVER_OUTPUT_DIR, 'server.js')
      ).default(assets)

      if (process.env.NODE_ENV === 'production') {
        require('./prod-server')(app)
      } else {
        require('./generate-index')(renderDocument)
        require('./dev-server')
      }
    }
  })
})

