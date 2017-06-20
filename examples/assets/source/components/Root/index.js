import React from 'react'
import { Link } from 'react-router'
import './style.css'

export default ({ children }) => (
  <div>
    <nav>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
      {children}
    </nav>
  </div>
)
