const spawn = require('cross-spawn')

module.exports = ({
  inputDir,
  extras
}) => {
  const result = spawn.sync(
    './node_modules/.bin/snazzy',
    [`${inputDir}/**/*.js`, extras].filter(arg => !!arg),
    {stdio: 'inherit'}
  )
  process.exit(result.status)
}
