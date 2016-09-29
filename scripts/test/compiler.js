const extensions = require('../../config/extensions')
const opts = require('../../config/babel')

function noop () { return {} }
[].concat(
  extensions['css'],
  extensions['sass'],
  extensions['audio'],
  extensions['fonts'],
  extensions['images'],
  extensions['video']
).forEach((ext) => {
  require.extensions[`.${ext}`] = noop
})

require('babel-register')(opts)
