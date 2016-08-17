const merge = require('webpack-merge')
const { applyConfig } = require('./lib/config-helpers')
const { join } = require('path')

const devConfig = require('./webpack.dev.config')
const build = require('./lib/build')
const serve = require('./lib/serve')
const { assign } = Object

const actions = { build, serve }

const smarterMerge = (configA, configB) => {
  const merged = merge.smart(configA, configB)
  return assign(merged, {
    plugins: (configA || []).plugins.concat(configB.plugins)
  })
}

module.exports = ({
  action = 'build',
  inputDir = join(process.cwd(), 'source'),
  outputDir = join(process.cwd(), 'dist'),
  basePath,
  sharedConfig,
  serverConfig,
  clientConfig,
  port
}) => {
  const config = {
    inputDir,
    outputDir,
    basePath
  }

  const shared = applyConfig(sharedConfig, config)

  const server = smarterMerge(serverConfig, shared)
  const client = smarterMerge(clientConfig, shared)

  return actions[action]({
    inputDir,
    outputDir,
    basePath,
    sharedConfig: shared,
    serverConfig: server,
    clientConfig: client,
    devConfig,
    port
  })
}
