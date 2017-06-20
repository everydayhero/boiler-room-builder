const { join } = require('path')
const createConfigs = require('../../lib/create-configs')
const serve = require('../../lib/serve')

const {
  inputDir = join(process.cwd(), 'source'),
  outputDir = join(process.cwd(), 'dist'),
  basePath = '/',
  cdnUrl = process.env.CDN_URL,
  config: sharedConfigPath,
  serverConfig: serverConfigPath,
  clientConfig: clientConfigPath,
  devConfig: devConfigPath,
  port = 8080,
  outputToBase = false
} = require('yargs').argv

const client = clientConfigPath
  ? require(join(process.cwd(), clientConfigPath))
  : {}
const server = serverConfigPath
  ? require(join(process.cwd(), serverConfigPath))
  : {}
const shared = sharedConfigPath
  ? require(join(process.cwd(), sharedConfigPath))
  : {}

const dev = devConfigPath
  ? require(join(process.cwd(), devConfigPath))
  : {}

const {
  clientConfig,
  serverConfig,
  devConfig
} = createConfigs({
  inputDir,
  outputDir,
  basePath,
  cdnUrl,
  client,
  server,
  shared,
  dev,
  outputToBase
})

serve({
  port,
  inputDir,
  outputDir,
  basePath,
  cdnUrl,
  clientConfig,
  serverConfig,
  devConfig
})
