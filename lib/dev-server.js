const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const { assign } = Object

module.exports = ({ clientConfig, devConfig }) => {
  const compiler = webpack(clientConfig)
  const syncedDevConfig = assign({}, devConfig, {
    publicPath: clientConfig.publicPath,
    contentBase: clientConfig.output.path
  })
  new WebpackDevServer(
    compiler,
    syncedDevConfig
  ).listen(8080, 'localhost')
}
