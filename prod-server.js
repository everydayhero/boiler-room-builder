const { join } = require('path')
const { createServer } = require('http')
const connect = require('connect')
const serveStatic = require('serve-static')
const { PUBLIC_PATH } = require('./constants')

const PORT = process.env.VIEW_SERVER_PORT || 8080

const server = connect()
server.use(serveStatic(join(process.cwd(), PUBLIC_PATH)))

module.exports = (app) => {
  server.use((req, res) => {
    app(req.url).then((html) => {
      res.end(html)
    }).catch((error) => {
      if (error.message.match(/^Not found/)) {
        res.status(404)
        app('/404').then((html) => {
          res.end(html)
        })
      } else {
        res.status(500)
        app('/500').then((html) => {
          res.end(html)
        })
      }
    })
  })

  createServer(server).listen(PORT, () => {
    console.log(`View server listening on ${PORT}`)
  })
}
