const path = require('path')
const assetsFromStats = require('../../lib/assets-from-stats')

module.exports = class {
  constructor ({ app } = {}) {
    this.app = app
  }

  apply (compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const { app } = this
      const { outputOptions, assets } = compilation
      const init = app.init || app.default || app
      const stats = compilation.getStats()
      const appAssets = assetsFromStats(stats, outputOptions.publicPath)

      return Promise.resolve({ assets: appAssets }).then(init).then((runner) => {
        const routes = runner.staticRoutes || ['/']

        return Promise.all(routes.map((route) => (
          runner(route).then(({ body, result }) => {
            if (result) {
              console.warn('`result` has been deprecated and will be removed in a future version of BRB. Please use `body` instead.')
            }

            assets[path.join(route.slice(1), 'index.html')] = {
              source () {
                return result || body
              },
              size () {
                return (result || body).length
              }
            }
          })
        )))
      }).then((results) => {
        callback()
      }).catch((e) => {
        callback(e)
      })
    })
  }
}
