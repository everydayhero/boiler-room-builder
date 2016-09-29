const { spawn } = require('child_process')
const { inputDir = './source' } = require('yargs').argv

const args = [
  require.resolve('standard/bin/cmd'),
  `${inputDir}/**/*.js`
].concat(process.argv.slice(2))

const lint = spawn(
  process.execPath,
  args
)
const format = spawn(
  process.execPath,
  [require.resolve('snazzy/bin/cmd')],
  { stdio: ['pipe', process.stdout, process.stderr] }
)
lint.stdout.pipe(format.stdin)

lint.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
  } else {
    process.exit(code)
  }
})
