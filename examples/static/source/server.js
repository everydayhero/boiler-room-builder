import { createServer } from 'boiler-room-runner'
import routes from './routes'

export default ({ assets }) => {
  const app = createServer({
    routes,
    assets
  })
  app.staticRoutes = [
    '/',
    '/about'
  ]

  return Promise.resolve(app)
}
