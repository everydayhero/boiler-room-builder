const { join } = require('path')
const { execSync } = require('child_process')

const original = require.extensions['.js']

const compiler = (
  sharedConfigPath,
  serverConfigPath
) => (m, filename) => {
  const source = execSync([
    'node',
    join(__dirname, 'webpack-stdout'),
    filename,
    sharedConfigPath,
    serverConfigPath
  ].join(' '))

  m._compile(source.toString(), filename)
}

const ignore = (m, filename) => (
  original.call(require, m, filename)
)

module.exports = (
  sharedConfigPath,
  serverConfigPath
) => {
  const compile = compiler(
    sharedConfigPath,
    serverConfigPath
  )
  require.extensions['.js'] = function webpackHook (m, filename) {
    if (filename.match(/-test.js$/)) {
      return compile(m, filename)
    } else {
      return ignore(m, filename)
    }
  }
}
