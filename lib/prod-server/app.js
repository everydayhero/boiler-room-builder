const { URL } = require('url')
const connect = require('connect')
const mount = require('connect-mount')
const bodyParser = require('body-parser')
const compression = require('compression')
const serveStatic = require('serve-static')
const logger = require('connect-logger')
const toPairs = require('lodash/toPairs')

const respondError = (res) => ({ message, stack }) => {
  console.log(message, stack)

  const errorMessage = res.statusCode === 404 ? 'Page not found' : 'Something went wrong'

  res.end(`
    <!doctype html>
    <meta charset="utf-8">
    <style type='text/css'>
      * { margin: 0; line-height: 1em; }
      body { padding: 3em; text-align: center; font: bold 120% system-ui, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      h1 { font-size: 4em; margin-bottom: 0.125em; }
      @media (min-width: 32em) {
        body { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -56.666%); font-size: 4vmin; }
      }
    </style>
    <title>${res.statusCode} - ${errorMessage}</title>
    <h1>😟<br> ${res.statusCode}</h1>
    <p>${errorMessage}</p>
  `)
}

const respondBody = (res) => ({ result, body }) => {
  if (result) {
    console.warn('`result` has been deprecated and will be removed in a future version of BRB. Please use `body` instead.')
  }

  res.end(result || body)
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
  compress = true,
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

  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  if (compress) {
    server.use(compression())
  }

  middlewares.forEach(middleware => server.use(middleware))

  if (cdnUrl) {
    const assetPath = new URL(cdnUrl).path
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

        respondBody(res)({ body, result })
      }
    }).catch((error) => {
      console.log(error)

      if (error.message.match(/^Not found/)) {
        res.setHeader('Content-Type', 'text/html')
        res.statusCode = 404

        return runner('/404', req)
          .then(respondBody(res))
          .catch(respondError(res))
      } else {
        res.setHeader('Content-Type', 'text/html')
        res.statusCode = 500

        return runner('/500', req)
          .then(respondBody(res))
          .catch(respondError(res))
      }
    })
  })
  return server
}
