const path = require('path')
const fs = require('fs-promise')
const s3 = require('s3')
const progressBar = require('progress-bar')

const client = s3.createClient({
  maxAsyncS3: 5,
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

module.exports = (
  dir,
  s3Config
) => {
  Promise.all([
    checkFileExists(dir, 'index.html'),
    checkFileExists(dir, 'main.js'),
    checkFileExists(dir, 'main.css')
  ]).then(() => deploy(dir, s3Config))
    .catch((err) => {
      console.log(err)
      process.exit(1)
    })
}

const checkFileExists = (dir, fileName) => (
  fs.open(path.join(dir, fileName), 'r')
)

const deploy = (dir, {
  bucket,
  prefix
}) => {
  const params = {
    localDir: dir,
    deleteRemoved: true,
    s3Params: {
      Bucket: bucket,
      Prefix: prefix
    }
  }

  const uploader = client.uploadDir(params)
  const bar = progressBar.create(process.stdout)

  bar.format = '$bar; $percentage;% uploaded.'

  uploader.on('progress', () => {
    const progress = uploader.progressAmount / uploader.progressTotal || 0
    bar.update(progress)
  })

  return new Promise((resolve, reject) => {
    uploader.on('error', (err) => {
      bar.update(0)
      return reject(err)
    })

    uploader.on('end', () => {
      bar.update(1)
      return resolve()
    })
  })
}
