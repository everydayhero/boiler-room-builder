import React from 'react'
import routes from './routes'
import { createClient } from 'boiler-room-runner'
import { render } from 'react-dom'

const App = createClient({ routes })

render(<App />, document.getElementById('mount'))
