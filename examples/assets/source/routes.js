import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Root from './components/Root'
import Home from './components/Home'
import About from './components/About'

export default (
  <Route path='/' component={Root}>
    <IndexRoute component={Home} />
    <Route path='/about' component={About} />
  </Route>
)
