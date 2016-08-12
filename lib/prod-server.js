const { createServer } = require('http')
const connect = require('connect')
const serveStatic = require('serve-static')
const logger = require('connect-logger')

const server = connect()

module.exports = ({
  port = 8080,
  staticDir,
  app
}) => {
  server.use(logger({
    format: '[%date - %time] %status %method %url'
  }))
  server.use(serveStatic(staticDir))
  server.use((req, res) => {
    app(req.url).then(({ result, redirect }) => {
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
        return app('/404').then(({ result }) => {
          res.end(result)
        })
      } else {
        res.statusCode = 500
        return app('/500').then(({ result }) => {
          res.end(result)
        })
      }
    }).catch((err) => {
      res.statusCode = 500
      res.end(err)
    })
  })

  createServer(server).listen(port, () => {
    console.log(`View server listening on ${port}`)
  })
}
