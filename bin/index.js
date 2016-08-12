#! /usr/bin/env node

const brb = require('../')
const { join } = require('path')

const {
  inputDir = process.env.BRB_INPUT_DIR,
  outputDir = process.env.BRB_OUTPUT_DIR,
  basePath = process.env.BRB_BASE_PATH,
  assetsPath = process.env.BRB_ASSETS_PATH,
  assetsUrl = process.env.BRB_ASSETS_URL,
  config: sharedConfigPath,
  serverConfig: serverConfigPath,
  clientConfig: clientConfigPath,
  _
} = require('yargs').argv

const action = _[0]

const clientConfig = clientConfigPath
  ? require(join(process.cwd(), clientConfigPath))
  : require('../webpack.client.config')
const serverConfig = serverConfigPath
  ? require(join(process.cwd(), serverConfigPath))
  : require('../webpack.server.config')
const sharedConfig = sharedConfigPath
  ? require(join(process.cwd(), sharedConfigPath))
  : require('../webpack.shared.config')

brb({
  action,
  inputDir,
  outputDir,
  basePath,
  assetsPath,
  assetsUrl,
  serverConfig,
  clientConfig,
  sharedConfig
})
