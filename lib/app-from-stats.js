const { join } = require('path')

module.exports = (stats) => {
  const { compilation } = stats
  const { outputOptions } = compilation
  const { path, filename } = outputOptions

  return require(join(path, filename))
}
