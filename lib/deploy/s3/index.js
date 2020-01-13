const s3 = require('s3-client')
const progressBar = require('progress-bar')
const { checkBuildFiles } = require('../utils')

module.exports = (
  dir,
  s3Config
) => {
  checkBuildFiles(dir)
    .then(() => deploy(dir, s3Config))
    .catch((err) => {
      console.log(err)
      process.exit(1)
    })
}

const client = s3.createClient({
  maxAsyncS3: 5,
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
})

const deploy = (dir, {
  bucket,
  prefix,
  deleteRemoved
}) => {
  const params = {
    localDir: dir,
    deleteRemoved,
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
