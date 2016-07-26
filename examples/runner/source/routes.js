import React from 'react'
import { Route } from 'react-router'

const Root = () => <div>Hey there!</div>

export default (
  <Route
    path='/'
    component={Root}
  />
)
