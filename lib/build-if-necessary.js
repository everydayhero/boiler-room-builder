const build = require('./build')
const fs = require('fs')
const { join } = require('path')

const readFile = (filename) => (
  new Promise((fulfill, reject) => {
    fs.readFile(filename, 'utf8', (err, res) => {
      try {
        fulfill(JSON.parse(res));
      } catch (ex) {
        reject(ex);
      }
    })
  })
)

const getPreviousResult = (brbBuildFile, callback) => (
  readFile(brbBuildFile)
    .then((brbBuild) => {
      brbBuild.app = require(brbBuild.app_path)
      return callback(brbBuild)
    })
)

module.exports = ({
  serverConfig,
  clientConfig,
  outputDir
}, 
  callback) => {
  const brbBuildFile = join(outputDir, '.brb_build.json')

  if (fs.existsSync(brbBuildFile)) {
    return getPreviousResult(brbBuildFile, callback)
  } else {
    return build({serverConfig, clientConfig}, callback)
  }
}
