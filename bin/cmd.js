#! /usr/bin/env node

const brb = require('../')

const {
  inputDir = process.env.BRB_INPUT_DIR,
  outputDir = process.env.BRB_OUTPUT_DIR,
  basePath = process.env.BRB_BASE_PATH,
  config: sharedConfigPath,
  serverConfig: serverConfigPath,
  clientConfig: clientConfigPath,
  devConfig: devConfigPath,
  port = 8080,
  watch,
  pattern,
  _
} = require('yargs').argv

const action = _[0]

brb({
  action,
  inputDir,
  outputDir,
  basePath,
  serverConfigPath,
  clientConfigPath,
  sharedConfigPath,
  devConfigPath,
  port,
  watch,
  pattern
})
