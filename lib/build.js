const compile = require('./compile')
const configs = require('./configs')

module.exports = ({
  inputDir,
  outputDir,
  basePath,
  sharedConfigPath,
  serverConfigPath,
  clientConfigPath
}) => {
  const {
    serverConfig,
    clientConfig
  } = configs({
    inputDir,
    outputDir,
    basePath,
    sharedConfigPath,
    serverConfigPath,
    clientConfigPath
  })

  compile({
    serverConfig,
    clientConfig
  })
}
