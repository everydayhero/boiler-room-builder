const webpack = require('webpack/lib/webpack.web.js')
const MemoryFS = require('memory-fs')

const mockpack = (fileSystem) => (
  (options, callback) => {
    return webpack(
      Object.assign({}, options, { inputFileSystem: fileSystem, outputFileSystem: fileSystem }),
      callback
      )
  }
)

const defaultFileStructure = ( ) => {
  const fs = new MemoryFS()
  fs.mkdirSync('/source')
  fs.writeFileSync('/source/client.js', 'yolo-client')
  fs.writeFileSync('/source/server.js', 'yolo-server')

  return fs
}

const defaultProxyOptions = (fileSystem = defaultFileStructure) => {
  return {
    webpack: mockpack(fileSystem()),
  }
}

module.exports = { mockpack, defaultFileStructure, defaultProxyOptions }
