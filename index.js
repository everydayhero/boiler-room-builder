const merge = require('webpack-merge')
const { applyConfig } = require('./lib/config-helpers')
const { join } = require('path')

const devConfig = require('./webpack.dev.config')
const build = require('./lib/build')
const serve = require('./lib/serve')

const actions = { build, serve }

module.exports = ({
  action = 'build',
  inputDir = join(process.cwd(), 'source'),
  outputDir = join(process.cwd(), 'dist'),
  basePath,
  assetsPath,
  assetsUrl,
  sharedConfig,
  serverConfig,
  clientConfig
}) => {
  const config = {
    inputDir,
    outputDir,
    basePath,
    assetsPath,
    assetsUrl
  }

  const shared = applyConfig(sharedConfig, config)

  const server = merge.smart(serverConfig, shared)
  const client = merge.smart(clientConfig, shared)

  return actions[action]({
    inputDir,
    outputDir,
    basePath,
    assetsPath,
    assetsUrl,
    sharedConfig: shared,
    serverConfig: server,
    clientConfig: client,
    devConfig
  })
}
