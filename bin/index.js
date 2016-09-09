#! /usr/bin/env node

const brb = require('../')
const { join } = require('path')

const {
  inputDir = process.env.BRB_INPUT_DIR,
  outputDir = process.env.BRB_OUTPUT_DIR,
  basePath = process.env.BRB_BASE_PATH,
  config: sharedConfigPath,
  serverConfig: serverConfigPath,
  clientConfig: clientConfigPath,
  devConfig: devConfigPath,
  port = 8080,
  _
} = require('yargs').argv

const action = _[0]

const clientConfig = clientConfigPath
  ? require(join(process.cwd(), clientConfigPath))
  : {}
const serverConfig = serverConfigPath
  ? require(join(process.cwd(), serverConfigPath))
  : {}
const sharedConfig = sharedConfigPath
  ? require(join(process.cwd(), sharedConfigPath))
  : {}
const devConfig = devConfigPath
  ? require(join(process.cwd(), devConfigPath))
  : {}

brb({
  action,
  inputDir,
  outputDir,
  basePath,
  serverConfig,
  clientConfig,
  sharedConfig,
  devConfig,
  port
})
