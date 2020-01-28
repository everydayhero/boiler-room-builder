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
  middlewareConfig: middlewareConfigPath,
  port = 8080,
  outputToBase = false,
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

const dev = devConfigPath
  ? require(join(process.cwd(), devConfigPath))
  : {}

const middleware = middlewareConfigPath
  ? require(join(process.cwd(), middlewareConfigPath))
  : { middlewares: [] }

const {
  clientConfig,
  serverConfig,
  devConfig,
  middlewaresConfig
} = createConfigs({
  inputDir,
  outputDir,
  basePath,
  cdnUrl,
  client,
  server,
  shared,
  dev,
  middleware,
  outputToBase,
  supportTypescript
})

serve({
  port,
  inputDir,
  outputDir,
  basePath,
  cdnUrl,
  clientConfig,
  serverConfig,
  devConfig,
  middlewaresConfig
})
