import { createServer } from 'boiler-room-runner'
import routes from './routes'

const basepath = process.env.BASE_PATH || '/'

export default ({ assets }) => {
  const app = createServer({
    routes,
    assets,
    basepath
  })

  app.staticRoutes = [
    '/',
    '/about'
  ]

  return app
}
