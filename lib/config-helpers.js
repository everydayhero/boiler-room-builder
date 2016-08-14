const { join } = require('path')

const PROD = process.env.NODE_ENV === 'production'

const { assign } = Object

const trimPath = (path = '') => (
  path.replace().replace(/^\/|\/$/g, '')
)

const ensureAbsolute = (path = '') => {
  if (!path) return '/'
  return `/${path}/`
}

const applyConfig = (webpackConfig, {
  inputDir,
  outputDir,
  basePath = ''
}) => {
  const absAssetsPath = ensureAbsolute(
    trimPath(basePath)
  )
  const publicPath = absAssetsPath
  const outputPath = PROD
    ? outputDir
    : join(outputDir, basePath)

  const { output } = webpackConfig

  return assign({}, webpackConfig, {
    context: inputDir,
    output: assign({}, output, {
      path: outputPath,
      publicPath
    })
  })
}

module.exports = { applyConfig }
