const createApp = require('./app')
const { createServer } = require('http')

module.exports = ({
  port = 8080,
  staticDir,
  runner,
  middlewares,
  basePath,
  cdnUrl
}) => {
  const app = createApp({
    staticDir,
    runner,
    middlewares,
    basePath,
    cdnUrl
  })

  createServer(app).listen(port, () => {
    console.log(`View server listening on ${port}`)
  })
}
