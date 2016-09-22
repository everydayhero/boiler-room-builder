const merge = require('webpack-merge')
const { applyConfig } = require('../lib/config-helpers')
const defaultSharedConfig = require('../webpack.shared.config')
const defaultClientConfig = require('../webpack.client.config')
const defaultServerConfig = require('../webpack.server.config')
const defaultDevConfig = require('../webpack.dev.config')

const { assign } = Object

const smarterMerge = (configA, configB) => {
  const merged = merge.smart(configA, configB)
  return assign(merged, {
    plugins: (configA.plugins || []).concat(configB.plugins || [])
  })
}

module.exports = ({
  sharedConfig,
  serverConfig,
  clientConfig,
  devConfig,
  inputDir,
  outputDir,
  basePath
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

  return {
    server,
    client,
    dev,
    shared
  }
}
