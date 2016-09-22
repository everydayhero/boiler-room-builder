const defaultSharedConfig = require('../webpack.shared.config')
const defaultClientConfig = require('../webpack.client.config')
const defaultServerConfig = require('../webpack.server.config')
const defaultDevConfig = require('../webpack.dev.config')

const { join } = require('path')
const merge = require('webpack-merge')

const PROD = process.env.NODE_ENV === 'production'

const { assign } = Object

const trimPath = (path = '') => (
  path.replace().replace(/^\/|\/$/g, '')
)

const ensureAbsolute = (path = '') => {
  if (!path) return '/'
  return `/${path}/`
}

const applyConfig = (webpackConfig, {
  inputDir = join(process.cwd(), 'source'),
  outputDir = join(process.cwd(), 'dist'),
  basePath = ''
}) => {
  const absAssetsPath = ensureAbsolute(
    trimPath(basePath)
  )

  const publicPath = absAssetsPath
  const outputPath = PROD
    ? outputDir
    : join(outputDir, basePath)

  const { output } = webpackConfig

  return assign({}, webpackConfig, {
    context: inputDir,
    output: assign({}, output, {
      path: outputPath,
      publicPath
    })
  })
}

const smarterMerge = (configA, configB) => {
  const merged = merge.smart(configA, configB)
  return assign(merged, {
    plugins: (configA.plugins || []).concat(configB.plugins || [])
  })
}

module.exports = ({
  inputDir,
  outputDir,
  basePath,
  sharedConfigPath,
  serverConfigPath,
  clientConfigPath,
  devConfigPath
}) => {
  const providedClientConfig = clientConfigPath
    ? require(join(process.cwd(), clientConfigPath))
    : {}
  const providedServerConfig = serverConfigPath
    ? require(join(process.cwd(), serverConfigPath))
    : {}
  const providedSharedConfig = sharedConfigPath
    ? require(join(process.cwd(), sharedConfigPath))
    : {}
  const providedDevConfig = devConfigPath
    ? require(join(process.cwd(), devConfigPath))
    : {}

  const config = {
    inputDir,
    outputDir,
    basePath
  }

  const sharedConfig = smarterMerge(
    defaultSharedConfig,
    providedSharedConfig
  )
  const serverConfig = applyConfig(
    smarterMerge(
      sharedConfig,
      smarterMerge(
        defaultServerConfig,
        providedServerConfig
      )
    ),
    config
  )
  const clientConfig = applyConfig(
    smarterMerge(
      sharedConfig,
      smarterMerge(
        defaultClientConfig,
        providedClientConfig
      )
    ),
    config
  )
  const devConfig = smarterMerge(
    defaultDevConfig,
    providedDevConfig
  )

  return {
    clientConfig,
    serverConfig,
    devConfig
  }
}
