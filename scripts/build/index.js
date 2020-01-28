const { join } = require('path')
const createConfigs = require('../../lib/create-configs')
const build = require('../../lib/build')

const {
  inputDir = join(process.cwd(), 'source'),
  outputDir = join(process.cwd(), 'dist'),
  basePath = '/',
  cdnUrl = process.env.CDN_URL,
  config: sharedConfigPath,
  serverConfig: serverConfigPath,
  clientConfig: clientConfigPath,
  outputToBase = false,
  forLambda = false,
  supportTypescript = false
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

const {
  clientConfig,
  serverConfig
} = createConfigs({
  inputDir,
  outputDir,
  basePath,
  cdnUrl,
  client,
  server,
  shared,
  outputToBase,
  forLambda,
  supportTypescript
})

build({
  inputDir,
  outputDir,
  basePath,
  clientConfig,
  serverConfig
})
