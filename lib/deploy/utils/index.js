const glob = require('glob-fs')()

const checkBuildFiles = (dir) => (
  new Promise((resolve, reject) => {
    glob.readdir(`${dir}/**/index.html`, (err, files) => {
      if (err) {
        return reject(err)
      }

      if (files.length) {
        resolve()
      } else {
        reject('No index.html found.')
      }
    })
  })
)

module.exports = {
  checkBuildFiles
}
