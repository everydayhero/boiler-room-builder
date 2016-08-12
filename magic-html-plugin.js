const { keys } = Object
const defaultRender = require('./lib/default-render-document')

module.exports = class {
  constructor ({ render = defaultRender } = {}) {
    this.render = render
  }

  apply (compiler) {
    compiler.plugin('emit', ({
      outputOptions,
      assets
    }, callback) => {
      const { render } = this
      const { publicPath } = outputOptions
      const appAssets = keys(assets).map((asset) => (
        publicPath + asset
      ))

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
