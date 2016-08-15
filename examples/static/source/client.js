import React from 'react'
import routes from './routes'
import { createClient } from 'boiler-room-runner'
import { render } from 'react-dom'

const basepath = process.env.BASE_PATH || '/'

const App = createClient({ routes, basepath })

render(<App />, document.getElementById('mount'))
