#! /usr/bin/env node

const brb = require('../')
const { join } = require('path')

const {
  serverConfig: serverConfigPath,
  clientConfig: clientConfigPath,
  devConfig: devConfigPath,
  _
} = require('yargs').argv

const action = _[0]

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
  action,
  serverConfig,
  clientConfig,
  devConfig
})
