const { checkBuildFiles } = require('../utils')
const ghPages = require('gh-pages')

module.exports = (dir) => {
  checkBuildFiles(dir)
    .then(() => deploy(dir))
    .catch((err) => {
      console.log(err)
      process.exit(1)
    })
}

const deploy = (dir) => (
  new Promise((resolve, reject) => {
    console.log('Publishing...')
    ghPages.publish(dir, (err) => {
      if (err) {
        reject(err)
      }

      console.log('Published.')
      resolve()
    })
  })
)
