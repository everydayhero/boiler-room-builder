const renderScripts = (scripts) => (
  scripts.map((script) => `<script src=${script}></script>`).join('')
)

const renderStyles = (styles) => (
  styles.map((style) => `<link rel="stylesheet" href=${style} />`).join('')
)

export const renderDocument = ({ assets = [], content = '' }) => {
  const styles = assets.filter((asset) => asset.match(/\.css$/))
  const scripts = assets.filter((asset) => asset.match(/\.js$/))

  return (`
    <!doctype html>
    <html>
      <head>
        ${renderStyles(styles)}
      </head>
      <body>
        <main id="mount">${content}</main>
      </body>
      ${renderScripts(scripts)}
    </html>
  `)
}

export default ({ assets }) => {
  const app = (route) => (
    Promise.resolve({
      result: renderDocument({
        content: `Route: ${route}`,
        assets
      })
    })
  )
  return app
}
