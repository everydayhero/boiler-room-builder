const {
  target,
  bucket,
  prefix,
  fnName,
  basePath = '/',
  dir = 'dist',
  deleteRemoved = true
} = require('yargs').argv
const deployGithubPages = require('../../lib/deploy/github-pages')
const deployS3 = require('../../lib/deploy/s3')
const deployLambda = require('../../lib/deploy/lambda')

if (target === 's3') {
  deployS3(dir, {
    bucket: bucket,
    prefix: prefix,
    deleteRemoved
  })
} else if (target === 'gh-pages') {
  deployGithubPages(dir)
} else if (target === 'lambda') {
  deployLambda(dir, {
    basePath,
    fnName,
    bucket,
    prefix
  })
} else {
  console.log('Invalid target')
  process.exit(9)
}
