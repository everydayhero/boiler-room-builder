const build = require('./lib/build')
const serve = require('./lib/serve')
const test = require('./lib/test')
const lint = require('./lib/lint')

const actions = {
  build,
  serve,
  test,
  lint
}

module.exports = (options) => {
  const { action } = options
  return actions[action](options)
}
