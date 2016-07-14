const { join } = require('path')
const {
  SERVER_OUTPUT_DIR
} = require('./constants')
const build = require('./build')

build('client', () => {
  build('server', () => {
    const {
      default: app,
      renderDocument
    } = require(join(SERVER_OUTPUT_DIR, 'server.js'))

    if (process.env.NODE_ENV === 'production') {
      require('./prod-server')(app)
    } else {
      require('./generate-index')(renderDocument)
      require('./dev-server')
    }
  })
})

