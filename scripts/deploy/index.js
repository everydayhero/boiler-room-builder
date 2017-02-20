const {
  target,
  bucket,
  prefix,
  dir = 'dist',
  deleteRemoved = true
} = require('yargs').argv
const deployGithubPages = require('../../lib/deploy/github-pages')
const deployS3 = require('../../lib/deploy/s3')

if (target === 's3') {
  deployS3(dir, {
    bucket: bucket,
    prefix: prefix,
    deleteRemoved
  })
} else if (target === 'gh-pages') {
  deployGithubPages(dir)
} else {
  console.log('Invalid target')
  process.exit(9)
}
