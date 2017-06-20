const glob = require('glob-fs')({ gitignore: false })

const checkBuildFiles = (dir) => (
  new Promise((resolve, reject) => {
    glob.readdir(`${dir}/**/index.html`, (err, files) => {
      if (err) {
        return reject(err)
      }

      if (files.length) {
        resolve()
      } else {
        reject(new Error('No index.html found.'))
      }
    })
  })
)

module.exports = {
  checkBuildFiles
}
