const compile = require('./compile')
const { assign } = Object

module.exports = ({
  serverConfig,
  clientConfig
}, callback = () => {}) => (
  compile(clientConfig, ({ compilation: clientCompilation }) => {
    const decoratedServerConfig = assign({}, serverConfig, {
      clientCompilation
    })

    compile(decoratedServerConfig, ({ compilation: serverCompilation }) => {
      callback({ serverCompilation, clientCompilation })
    })
  })
)
