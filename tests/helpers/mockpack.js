const webpack = require('webpack/lib/webpack.web.js')

module.exports = (fileSystem) => (
  (options, callback) => (
    webpack(
      Object.assign({}, options, { inputFileSystem: fileSystem, outputFileSystem: fileSystem }),
      callback
    )
  )
)
