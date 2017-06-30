const doc = ({
  title,
  content,
  state = {},
  styles = ['/main.css'],
  scripts = ['/main.js']
}) => (
  `<!doctype html>
  <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      ${styles.map((s, i) => `<link rel="stylesheet" href="${s}" />`)}
    </head>
    <body>
      <main id="mount">${content}</main>
      <script id="initial-state" type="application/json">
        ${JSON.stringify(state)}
      </script>
      ${scripts.map((s, i) => `<script src="${s}"></script>`)}
    </body>
  </html>`
)

module.exports = ({ assets }) => {
  const styles = assets.filter((asset) => asset.match(/\.css$/))
  const scripts = assets.filter((asset) => asset.match(/\.js$/))

  return doc({ styles, scripts })
}
