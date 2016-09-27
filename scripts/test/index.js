const { join } = require('path')
const { spawn } = require('child_process')
const { inputDir = './source' } = require('yargs').argv

const defaultOpts = [
  `--compilers`,
  `js:${join(__dirname, './compiler.js')}`
]

const args = [
  require.resolve('mocha/bin/_mocha'),
  `${inputDir}/**/__tests__/*-test.js`
].concat(
  defaultOpts,
  process.argv.slice(2)
).filter(Boolean)

spawn(process.execPath, args, { stdio: 'inherit' })
