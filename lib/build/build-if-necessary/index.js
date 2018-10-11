const fs = require('fs')
const { join } = require('path')
const build = require('../index')
const getPreviousResult = require('./get-previous-result')
const buildResultFilename = require('../build-result-filename')

module.exports = ({
  serverConfig,
  clientConfig,
  outputDir
}, callback) => {
  const brbBuildFile = join(outputDir, buildResultFilename)

  if (fs.existsSync(brbBuildFile)) {
    return getPreviousResult(brbBuildFile, callback)
  } else {
    return build({ serverConfig, clientConfig }, callback)
  }
}
