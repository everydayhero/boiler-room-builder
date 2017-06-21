const createApp = require('./app')
const { createServer } = require('http')

module.exports = ({
  port = 8080,
  staticDir,
  runner,
  basePath
}) => {
  const app = createApp({
    staticDir,
    runner,
    basePath
  })

  createServer(app).listen(port, () => {
    console.log(`View server listening on ${port}`)
  })
}
