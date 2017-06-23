const fs = require('fs')
const { join } = require('path')
const build = require('../build')
const getPreviousResult = require('./get-previous-result')

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
