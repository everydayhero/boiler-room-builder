const { createServer } = require('http')
const { parse: parseUrl } = require('url')
const connect = require('connect')
const mount = require('connect-mount')
const serveStatic = require('serve-static')
const logger = require('connect-logger')

const server = connect()

const respondError = (res) => ({ message, stack }) => {
  res.end(`${message}\n${stack}`)
}

module.exports = ({
  port = 8080,
  staticDir,
  runner,
  basePath,
  cdnUrl
}) => {
  const baseMatch = new RegExp(`^${basePath}`)
  server.use(logger({
    format: '[%date - %time] %status %method %url'
  }))
  if (cdnUrl) {
    const assetPath = parseUrl(cdnUrl).path
    server.use(mount(assetPath, serveStatic(staticDir)))
  } else {
    server.use(serveStatic(staticDir))
  }
  server.use((req, res) => {
    const url = req.url.replace(baseMatch, '/')
    runner(url).then(({ result, redirect }) => {
      if (redirect) {
        res.statusCode = 301
        res.setHeader('Location', redirect)
        res.end()
      } else {
        res.statusCode = 200
        res.end(result)
      }
    }).catch((error) => {
      if (error.message.match(/^Not found/)) {
        res.statusCode = 404
        return runner('/404').then(({ result }) => {
          res.end(result)
        }).catch(respondError(res))
      } else {
        res.statusCode = 500
        return runner('/500').then(({ result }) => {
          res.end(result)
        }).catch(respondError(res))
      }
    })
  })

  createServer(server).listen(port, () => {
    console.log(`View server listening on ${port}`)
  })
}
