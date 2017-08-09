const fs = require('fs')

const readFile = (filename) => (
  new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, res) => {
      if (err) { return reject(err) }
      try {
        resolve(JSON.parse(res))
      } catch (e) {
        reject(e)
      }
    })
  })
)

const getPreviousResult = (brbBuildFile, callback) => (
  readFile(brbBuildFile)
    .then((brbBuild) => {
      const {assets, app_path} = brbBuild
      const app = require(app_path)
      return callback({app, assets, app_path}) // eslint-disable-line standard/no-callback-literal
    })
)

module.exports = getPreviousResult
