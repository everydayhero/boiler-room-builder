import React from 'react'
import { Link } from 'react-router'

const addBase = (path) => (
  `${(process.env.BASE_PATH || '').replace(/\/$/, '') || '/'}${path.slice(1)}`
)

export default ({ children }) => (
  <div>
    <nav>
      <Link to={addBase('/')}>Home</Link>
      <Link to={addBase('/about')}>About</Link>
      {children}
    </nav>
  </div>
)
