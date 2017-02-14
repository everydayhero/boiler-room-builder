const { inputDir = './source' } = require('yargs').argv
const program = require('commander')
const deployS3 = require('../../lib/deploy/s3')
const deployGhp = require('../../lib/deploy/ghp')

const args = [
  require.resolve('standard/bin/cmd'),
  `${inputDir}/**/*.js`
].concat(process.argv.slice(2))

program
  .option('-t, --target [target]', 'Target', /^(gh-pages|s3)$/i, null)
  .option('-d, --dir [dir]', 'Directory', 'dist')
  .option('-b, --bucket [bucket]', 'S3 Bucket', null)
  .option('-p, --prefix [prefix]', 'S3 Prefix', null)
  .parse(args)

if (program.target === 's3') {
  deployS3(program.dir, {
    bucket: program.bucket,
    prefix: program.prefix
  })
} else if (program.target === 'gh-pages') {
  deployGhp(program.dir)
} else {
  console.log('Invalid target')
  process.exit(9)
}
