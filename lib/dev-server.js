const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const MagicHTMLPlugin = require('../plugins/magic-html-plugin')
const { assign, keys } = Object

const addDevServerToEntries = (entries = {}, port) => (
  keys(entries).reduce((acc, name) => (assign({}, acc, {
    [name]: (
      [`webpack-dev-server/client?http://0.0.0.0:${port}`]
    ).concat(entries[name])
  })), {})
)

module.exports = ({
  app = {},
  port = 8080,
  contentBase,
  clientConfig,
  devConfig,
  middlewares = []
}) => {
  const { publicPath } = clientConfig.output

  const syncedClientConfig = assign({}, clientConfig, {
    entry: addDevServerToEntries(clientConfig.entry, port)
  })

  const syncedDevConfig = assign({}, devConfig, {
    contentBase,
    publicPath,
    historyApiFallback: {
      index: publicPath
    },
    before: (app) => {
      middlewares.forEach(middleware => app.use(middleware))
    }
  })

  const compiler = webpack(syncedClientConfig)

  const render = app.renderDocument
  compiler.apply(new MagicHTMLPlugin({ render }))

  new WebpackDevServer(
    compiler,
    syncedDevConfig
  ).listen(port, '0.0.0.0')
}
