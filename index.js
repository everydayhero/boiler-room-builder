const merge = require('webpack-merge')
const { applyConfig } = require('./lib/config-helpers')
const { join } = require('path')

const defaultSharedConfig = require('./webpack.shared.config')
const defaultClientConfig = require('./webpack.client.config')
const defaultServerConfig = require('./webpack.server.config')
const defaultDevConfig = require('./webpack.dev.config')

const build = require('./lib/build')
const serve = require('./lib/serve')

const { assign } = Object

const actions = { build, serve }

const smarterMerge = (configA, configB) => {
  const merged = merge.smart(configA, configB)
  return assign(merged, {
    plugins: (configA.plugins || []).concat(configB.plugins || [])
  })
}

module.exports = ({
  action = 'build',
  inputDir = join(process.cwd(), 'source'),
  outputDir = join(process.cwd(), 'dist'),
  basePath = '/',
  sharedConfig = {},
  serverConfig = {},
  clientConfig = {},
  devConfig = {},
  port = 8080
}) => {
  const config = {
    inputDir,
    outputDir,
    basePath
  }

  const shared = smarterMerge(
    defaultSharedConfig,
    sharedConfig
  )
  const server = applyConfig(
    smarterMerge(
      shared,
      smarterMerge(
        defaultServerConfig,
        serverConfig
      )
    ),
    config
  )
  const client = applyConfig(
    smarterMerge(
      shared,
      smarterMerge(
        defaultClientConfig,
        clientConfig
      )
    ),
    config
  )
  const dev = smarterMerge(
    defaultDevConfig,
    devConfig
  )

  return actions[action]({
    inputDir,
    outputDir,
    basePath,
    serverConfig: server,
    clientConfig: client,
    devConfig: dev,
    port
  })
}
