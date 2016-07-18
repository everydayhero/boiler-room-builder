const { join } = require('path')
const { createServer } = require('http')
const connect = require('connect')
const serveStatic = require('serve-static')

const PORT = process.env.VIEW_SERVER_PORT || 8080

const server = connect()

module.exports = (outputDir, app) => {
  server.use(serveStatic(join(outputDir)))
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
        app('/404').then(({ result }) => {
          res.end(result)
        })
      } else {
        res.statusCode = 500
        app('/500').then(({ result }) => {
          res.end(result)
        })
      }
    })
  })

  createServer(server).listen(PORT, () => {
    console.log(`View server listening on ${PORT}`)
  })
}
