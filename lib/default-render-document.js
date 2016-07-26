const Document = require('boiler-room-runner/dist/server/Document')
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { keys } = Object

module.exports = (assets) => {
  const assetList = keys(assets)
  const styles = assetList.filter((asset) => asset.match(/\.css$/))
  const scripts = assetList.filter((asset) => asset.match(/\.js$/))

  return () => (
    '<!doctype html>' + renderToStaticMarkup(
      createElement(Document, {
        styles,
        scripts
      })
    )
  )
}
