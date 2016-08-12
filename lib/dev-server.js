const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const { assign, keys } = Object

const addDevServerToEntries = (entries = {}, port) => (
  keys(entries).reduce((acc, name) => (assign({}, acc, {
    [name]: (
      [`webpack-dev-server/client?http://0.0.0.0:${port}`]
    ).concat(entries[name])
  })), {})
)

module.exports = ({
  port = 8080,
  clientConfig,
  devConfig
}) => {
  const syncedClientConfig = assign({}, clientConfig, {
    entry: addDevServerToEntries(clientConfig.entry, port)
  })
  const syncedDevConfig = assign({}, devConfig, {
    publicPath: clientConfig.publicPath,
    contentBase: clientConfig.output.path
  })

  const compiler = webpack(syncedClientConfig)

  new WebpackDevServer(
    compiler,
    syncedDevConfig
  ).listen(port, 'localhost')
}
