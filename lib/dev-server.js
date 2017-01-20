const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const MagicHTMLPlugin = require('../plugins/magic-html-plugin')
const Dashboard = require('webpack-dashboard')
const DashboardPlugin = require('webpack-dashboard/plugin')
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
  devConfig
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
    }
  })
  delete syncedDevConfig.plugins

  const compiler = webpack(syncedClientConfig)

  const dashboard = new Dashboard()
  compiler.apply(new DashboardPlugin(dashboard.setData))

  const render = app.renderDocument
  compiler.apply(new MagicHTMLPlugin({ render }))

  new WebpackDevServer(
    compiler,
    syncedDevConfig
  ).listen(port, '0.0.0.0')
}
