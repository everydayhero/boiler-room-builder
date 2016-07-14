const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const config = require('./webpack.client.config')

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  contentBase: 'priv/static/',
  publicPath: '/assets/',
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
