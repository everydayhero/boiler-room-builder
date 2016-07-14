const { join } = require('path')
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const config = require(join(process.cwd(), 'webpack.client.config'))
const { CLIENT_OUTPUT_DIR, ASSET_PATH } = require('./constants')

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  contentBase: CLIENT_OUTPUT_DIR,
  publicPath: ASSET_PATH,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  stats: {
    assets: true,
    colors: true,
    version: true,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: true
  }
})

server.listen(8080, 'localhost')
