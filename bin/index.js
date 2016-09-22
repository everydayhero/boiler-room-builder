#! /usr/bin/env node

const { spawn } = require('child_process')
const { join } = require('path')

let args = [
  join(__dirname, './cmd.js')
]

const isNodeArg = (arg) => (
  arg === 'debug' ||
  arg === '--debug' ||
  arg === '--debug-bk'
)

process.argv.slice(2).forEach((arg) => {
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
