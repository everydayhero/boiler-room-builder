const initialiseMiddlewares = (middlewareConfigs = { middlewares: [] }) => {
  return middlewareConfigs.middlewares.map(({ middleware, options }) => {
    if (typeof middleware === 'string') {
      const middlewareBuilder = require(middleware)
      return middlewareBuilder(options)
    }
    return middleware
  })
}

module.exports = initialiseMiddlewares
