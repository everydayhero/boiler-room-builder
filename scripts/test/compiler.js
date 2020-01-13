const extensions = require('../../config/extensions')
const opts = require('../../config/babel')

function noop () { return {} }
[].concat(
  extensions.css,
  extensions.audio,
  extensions.fonts,
  extensions.images,
  extensions.video
).forEach((ext) => {
  require.extensions[`.${ext}`] = noop // eslint-disable-line node/no-deprecated-api
})

require('@babel/register')(opts)
