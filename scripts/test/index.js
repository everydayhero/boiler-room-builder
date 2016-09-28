const { join } = require('path')
const { spawn } = require('child_process')
const { inputDir = './source' } = require('yargs').argv

const defaultOpts = [
  '--recursive',
  '--require',
  join(__dirname, './setup.js'),
  '--compilers',
  `js:${join(__dirname, './compiler.js')}`
]

const args = [
  require.resolve('mocha/bin/_mocha'),
  `${inputDir}/**/__tests__/*-test.js`
].concat(
  defaultOpts,
  process.argv.slice(2)
).filter(Boolean)

const test = spawn(process.execPath, args, { stdio: 'inherit' })

test.on('exit', (code, signal) => {
  process.on('exit', () => {
    if (signal) {
      process.kill(process.pid, signal)
    } else {
      process.exit(code)
    }
  })
})
