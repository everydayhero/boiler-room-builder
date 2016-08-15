import React from 'react'
import { Link } from 'react-router'

export default ({ children }) => (
  <div>
    <nav>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
      {children}
    </nav>
  </div>
)
