const path = require('path')
const fs = require('fs-promise')

const checkBuildFiles = (dir) => (
  Promise.all([
    checkFileExists(dir, 'index.html'),
    checkFileExists(dir, 'main.js'),
    checkFileExists(dir, 'main.css')
  ])
)

const checkFileExists = (dir, fileName) => (
  fs.open(path.join(dir, fileName), 'r')
)

module.exports = {
  checkBuildFiles
}
