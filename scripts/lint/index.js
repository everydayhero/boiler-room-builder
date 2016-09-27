const { spawn } = require('child_process')
const { inputDir = './source' } = require('yargs').argv

const args = [
  require.resolve('standard/bin/cmd'),
  `${inputDir}/**/*.js`
].concat(process.argv.slice(2))

spawn(process.execPath, args, { stdio: 'inherit' })
