const build = require('../build')
const fs = require('fs')
const { join } = require('path')

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
      return callback({app, assets})
    })
)

module.exports = ({
  serverConfig,
  clientConfig,
  outputDir
}, callback) => {
  const brbBuildFile = join(outputDir, '.brb_build.json')

  if (fs.existsSync(brbBuildFile)) {
    return getPreviousResult(brbBuildFile, callback)
  } else {
    return build({serverConfig, clientConfig}, callback)
  }
}
