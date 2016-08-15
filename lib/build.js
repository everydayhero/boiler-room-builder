const compile = require('./compile')
const { assign } = Object

module.exports = ({
  serverConfig,
  clientConfig
}, callback = () => {}) => (
  compile(clientConfig, (clientStats) => {
    const decoratedServerConfig = assign({}, serverConfig, {
      clientStats
    })

    compile(decoratedServerConfig, (serverStats) => {
      callback({ serverStats, clientStats })
    })
  })
)
