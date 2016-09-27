#! /usr/bin/env node

const { spawn } = require('child_process')
const { join } = require('path')

const isNodeArg = (arg) => (
  arg === 'debug' ||
  arg === '--debug' ||
  arg === '--debug-bk'
)

const script = process.argv[2]

let args = [
  join(__dirname, `../scripts/${script}`)
]

process.argv.slice(3).forEach((arg) => {
  if (isNodeArg(arg)) {
    args.unshift(arg)
  } else {
    args.push(arg)
  }
})

const proc = spawn(
  process.execPath,
  args,
  { stdio: 'inherit' }
)

proc.on('exit', (code, signal) => {
  process.on('exit', () => {
    if (signal) {
      process.kill(process.pid, signal)
    } else {
      process.exit(code)
    }
  })
})

