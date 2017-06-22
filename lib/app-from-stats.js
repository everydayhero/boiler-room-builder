const { join } = require('path')

module.exports = (stats) => {
  const { compilation } = stats
  const { outputOptions } = compilation
  const { path, filename } = outputOptions

  return join(path, filename)
}
