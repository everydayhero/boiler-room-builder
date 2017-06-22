const assetsFromStats = require('./assets-from-stats')
const appFromStats = require('./app-from-stats')
const fs = require('fs')
const { join } = require('path')

module.exports = ({
  serverStats,
  clientStats
}) => {
  const { compilation } = clientStats
  const { outputOptions } = compilation
  const assets = assetsFromStats(clientStats, outputOptions.publicPath)

  const appPath = appFromStats(serverStats)
  const brbBuildFile = join(outputOptions.path, '.brb_build.json')
  const result = {assets, app_path: appPath}
  fs.writeFileSync(brbBuildFile, JSON.stringify(result), 'utf8')
  return result
}
