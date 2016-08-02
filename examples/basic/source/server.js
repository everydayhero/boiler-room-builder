const initApp = ({ assets }) => {
  const app = (route) => (
    Promise.resolve({
      result: `Route: ${route}`
    })
  )
  app.empty = () => 'The empty version of the app'
  return app
}

export default initApp
