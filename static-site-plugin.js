const path = require('path')
const assetsFromStats = require('./lib/assets-from-stats')

const requireFromString = (filename, code) => {
  const Module = module.constructor
  const paths = Module._nodeModulePaths(path.dirname(filename))
  const m = new Module(filename, module.parent)
  m.filename = filename
  m.paths = paths
  m._compile(code, filename)
  return m.exports
}

module.exports = class {
  constructor ({
    filename = 'server.js'
  } = {}) {
    this.filename = filename
  }

  apply (compiler) {
    compiler.plugin('emit', ({
      outputOptions,
      compiler,
      assets
    }, callback) => {
      const { filename } = this
      const { path: outputPath } = outputOptions
      const { options } = compiler
      const { clientStats = {} } = options
      const { compilation: clientCompilation = { toJson () { return {} } } } = clientStats
      const { outputOptions: clientOutput } = clientCompilation

      const appAssets = assetsFromStats(clientStats, clientOutput.publicPath)

      const source = assets[filename].source()
      const { default: initApp } = requireFromString(
        path.join(outputPath, filename),
        source
      )

      return Promise.resolve({ assets: appAssets }).then(initApp).then((app) => (
        Promise.all(app.staticRoutes.map((route) => {
          app(`${clientOutput.publicPath}${route.slice(1)}`).then(({ result }) => {
            assets[path.join(route.slice(1), 'index.html')] = {
              source () {
                return result
              },
              size () {
                return result.length
              }
            }
          })
        }))
      )).then((results) => {
        callback()
      }).catch((e) => {
        callback(e)
      })
    })
  }
}
