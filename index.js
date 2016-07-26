const build = require('./lib/build')
const serve = require('./lib/serve')

const actions = { build, serve }

module.exports = ({
  action = 'build',
  serverConfig,
  clientConfig,
  devConfig
}) => (
  actions[action]({
    serverConfig,
    clientConfig,
    devConfig
  })
)
