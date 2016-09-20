const spawn = require('cross-spawn')
const args = process.argv.slice(3)

module.exports = (path) => {
  var result = spawn.sync(
    './node_modules/.bin/snazzy',
    args,
    {stdio: 'inherit'}
  )
  process.exit(result.status)
}
