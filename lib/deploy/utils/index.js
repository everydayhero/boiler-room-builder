const glob = require('fast-glob')

const checkBuildFiles = (dir) => (
  glob([`${dir}/**/index.html`], { dot: false })
    .then((entries) => {
      if (entries.length) {
        return entries
      }
      throw new Error('No index.html found.')
    })
)

module.exports = {
  checkBuildFiles
}
