#! /usr/bin/env node

const brb = require('../')
const { join } = require('path')

const {
  serve = false,
  serverConfig: serverConfigPath,
  clientConfig: clientConfigPath,
  devConfig: devConfigPath
} = require('yargs').argv

const clientConfig = clientConfigPath
  ? require(join(process.cwd(), clientConfigPath))
  : require('../webpack.client.config')
const serverConfig = serverConfigPath
  ? require(join(process.cwd(), serverConfigPath))
  : require('../webpack.server.config')
const devConfig = devConfigPath
  ? require(join(process.cwd(), devConfigPath))
  : require('../webpack.dev.config')

brb({
  serve,
  serverConfig,
  clientConfig,
  devConfig
})
