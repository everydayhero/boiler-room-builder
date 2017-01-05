#! /usr/bin/env node

const kexec = require('kexec')
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

kexec(process.execPath, args)
