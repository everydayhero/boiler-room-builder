const assetsFromStats = require('../../lib/assets-from-stats')
const defaultRender = require('../../lib/default-render-document')

module.exports = class {
  constructor ({ render = defaultRender } = {}) {
    this.render = render
  }

  apply (compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const { render } = this
      const { outputOptions, assets } = compilation

      const stats = compilation.getStats()
      const appAssets = assetsFromStats(stats, outputOptions.publicPath)
      const html = render({ assets: appAssets })

      assets['index.html'] = {
        source () {
          return html
        },
        size () {
          return html.length
        }
      }
      callback()
    })
  }
}
