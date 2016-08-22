const MagicHTMLPlugin = require('../magic-html-plugin')
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
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
  port = 8080,
  outputDir,
  clientConfig,
  devConfig
}) => {
  const syncedClientConfig = assign({}, clientConfig, {
    entry: addDevServerToEntries(clientConfig.entry, port),
    plugins: (clientConfig.plugins || []).concat(
      new MagicHTMLPlugin()
    )
  })
  const syncedDevConfig = assign({}, devConfig, {
    publicPath: clientConfig.output.publicPath,
    contentBase: outputDir,
    historyApiFallback: {
      index: clientConfig.output.publicPath
    }
  })

  const compiler = webpack(syncedClientConfig)
  const dashboard = new Dashboard()
  compiler.apply(new DashboardPlugin(dashboard.setData))

  new WebpackDevServer(
    compiler,
    syncedDevConfig
  ).listen(port, 'localhost')
}
