const { parse: parseUrl } = require('url')
const connect = require('connect')
const mount = require('connect-mount')
const serveStatic = require('serve-static')
const logger = require('connect-logger')

const server = connect()

const respondError = (res) => ({ message, stack }) => {
  res.end(`${message}\n${stack}`)
}

const setHeaders = (res, path) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (serveStatic.mime.lookup(path) === 'text/html') {
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

const staticOpts = {
  maxAge: '1y',
  setHeaders
}

module.exports = ({
  basePath,
  cdnUrl,
  enableLogging = true,
  runner,
  staticDir
}) => {
  const baseMatch = new RegExp(`^${basePath}`)

  if (enableLogging) {
    server.use(logger({
      format: JSON.stringify({
        date: '%date',
        duration: '%time',
        status: '%status',
        method: '%method',
        path: '%url'
      }),
      date: 'YYYY-MM-DD HH:mm:ss.SSS'
    }))
  }

  if (cdnUrl) {
    const assetPath = parseUrl(cdnUrl).path
    server.use(mount(assetPath, serveStatic(staticDir, staticOpts)))
  } else {
    server.use(serveStatic(staticDir, staticOpts))
  }
  server.use((req, res) => {
    const url = req.url.replace(baseMatch, '/')
    runner(url).then(({ result, redirect }) => {
      if (redirect) {
        res.statusCode = 301
        res.setHeader('Location', redirect)
        res.setHeader('Cache-Control', 'no-cache')
        res.end()
      } else {
        res.setHeader('Content-Type', 'text/html')
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
  return server
}
