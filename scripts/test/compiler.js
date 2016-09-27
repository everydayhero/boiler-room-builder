require('babel-register')({
  presets: [
    'es2015',
    'stage-0',
    'react'
  ]
})

function noop () { return {} }

require.extensions['.sass'] = noop
require.extensions['.scss'] = noop
require.extensions['.css'] = noop
require.extensions['.svg'] = noop
