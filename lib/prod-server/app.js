const { parse: parseUrl } = require('url')
const connect = require('connect')
const mount = require('connect-mount')
const serveStatic = require('serve-static')
const logger = require('connect-logger')
const toPairs = require('lodash/toPairs')

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
  middlewares = [],
  staticDir
}) => {
  const server = connect()
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

  middlewares.forEach(middleware => server.use(middleware))

  if (cdnUrl) {
    const assetPath = parseUrl(cdnUrl).path
    server.use(mount(assetPath, serveStatic(staticDir, staticOpts)))
  } else {
    server.use(serveStatic(staticDir, staticOpts))
  }

  server.use((req, res) => {
    const url = req.url.replace(baseMatch, '/')
    runner(url, req).then(({ result, redirect, status = 200, headers = {}, body }) => {
      if (redirect) {
        res.statusCode = 301
        res.setHeader('Location', redirect)
        res.setHeader('Cache-Control', 'no-cache')
        res.end()
      } else {
        res.setHeader('Content-Type', 'text/html')
        res.statusCode = status

        toPairs(headers).forEach(([key, value]) => (
          res.setHeader(key, value)
        ))

        if (result) {
          console.warn('`result` has been deprecated and will be removed in a future version of BRB. Please use `body` instead.')
        }

        res.end(result || body)
      }
    }).catch((error) => {
      console.log(error)

      if (error.message.match(/^Not found/)) {
        res.setHeader('Content-Type', 'text/html')
        res.statusCode = 404
        return runner('/404').then(({ result }) => {
          res.end(result)
        }).catch(respondError(res))
      } else {
        res.setHeader('Content-Type', 'text/html')
        res.statusCode = 500
        return runner('/500').then(({ result }) => {
          res.end(result)
        }).catch(respondError(res))
      }
    })
  })
  return server
}
