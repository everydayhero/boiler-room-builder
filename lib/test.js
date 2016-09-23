const spawn = require('cross-spawn')

module.exports = ({
  inputDir,
  extras
}) => {
  const result = spawn.sync(
    './node_modules/.bin/mocha',
  [
    '--opts',
    `${__dirname}/../mocha/mocha.opts`,
    `${inputDir}/**/*-spec.js`,
    extras
  ].filter(arg => !!arg),
    {stdio: 'inherit'}
  )
  process.exit(result.status)
}
