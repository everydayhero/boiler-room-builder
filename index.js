const { join } = require('path')
const configMerge = require('./lib/configMerge')

const build = require('./lib/build')
const serve = require('./lib/serve')
const lint = require('./lib/lint')


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
  let config = {}

  if (action === 'build' || action === 'serve') {
    config = configMerge({
      sharedConfig,
      serverConfig,
      clientConfig,
      devConfig,
      inputDir,
      outputDir,
      basePath
    })
  }

  return actions[action]({
    inputDir,
    outputDir,
    basePath,
    serverConfig: config.server,
    clientConfig: config.client,
    devConfig: config.dev,
    port,
  })
}
