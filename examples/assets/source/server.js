import { createServer } from 'boiler-room-runner'
import routes from './routes'
import customRender from './lib/renderDocument'

export const renderDocument = customRender

export default ({ assets }) => (
  createServer({
    routes,
    assets,
    renderDocument
  })
)
