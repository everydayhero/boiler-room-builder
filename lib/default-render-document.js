const Document = require('boiler-room-runner/dist/server/Document')
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

module.exports = ({ assets }) => {
  const styles = assets.filter((asset) => asset.match(/\.css$/))
  const scripts = assets.filter((asset) => asset.match(/\.js$/))

  return (
    '<!doctype html>' + renderToStaticMarkup(
      createElement(Document, {
        styles,
        scripts
      })
    )
  )
}
