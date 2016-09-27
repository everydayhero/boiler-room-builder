const { spawn } = require('child_process')
const { inputDir = './source' } = require('yargs').argv

const args = [
  require.resolve('mocha/bin/_mocha'),
  `${inputDir}/**/__tests__/*-test.js`
].concat(process.argv.slice(2))

spawn(process.execPath, args, { stdio: 'inherit' })
