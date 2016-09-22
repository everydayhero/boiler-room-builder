const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const { dirname, basename } = require('path')
const configs = require('./configs')

const { assign } = Object

const fs = new MemoryFS()

const FILENAME = process.argv[2]
const SHARED_CONFIG_PATH = process.argv[3]
const SERVER_CONFIG_PATH = process.argv[4]

const main = (filename, sharedConfigPath, serverConfigPath) => {
  const { serverConfig } = configs({
    sharedConfigPath,
    serverConfigPath
  })

  const { output } = serverConfig

  const config = assign(serverConfig, {
    bail: true,
    entry: filename,
    output: assign({}, output, {
      path: dirname(filename),
      filename: basename(filename)
    })
  })
  const compiler = webpack(config)
  compiler.outputFileSystem = fs

  compiler.run((error, { compilation } = {}) => {
    if (error) throw error
    const { assets } = compilation
    const source = assets[basename(filename)].source()
    console.log(source)
  })
}

main(FILENAME, SHARED_CONFIG_PATH, SERVER_CONFIG_PATH)
