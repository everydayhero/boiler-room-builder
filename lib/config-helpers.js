const PROD = process.env.NODE_ENV === 'production'

const { assign } = Object

const compact = (arr = []) => (
  arr.filter(Boolean)
)

const trimPath = (path = '') => (
  path.replace().replace(/^\/|\/$/g, '')
)

const ensureAbsolute = (path = '') => {
  if (!path) return '/'
  return `/${path}/`
}

const devPublicPath = ({
  basePath,
  assetsPath
}) => (ensureAbsolute(compact([
  trimPath(basePath || ''),
  trimPath(assetsPath || '')
]).join('/')))

const prodPublicPath = ({
  assetsUrl,
  basePath,
  assetsPath
}) => {
  if (assetsUrl) {
    return assetsUrl
  } else {
    return devPublicPath({ basePath, assetsPath })
  }
}

const applyConfig = (webpackConfig, {
  inputDir,
  outputDir,
  basePath,
  assetsPath,
  assetsUrl
}) => {
  const publicPath = PROD
    ? prodPublicPath({ assetsUrl, assetsPath })
    : devPublicPath({ basePath, assetsPath })

  const { output } = webpackConfig

  return assign({}, webpackConfig, {
    context: inputDir,
    output: assign({}, output, {
      path: outputDir,
      publicPath
    })
  })
}

module.exports = { applyConfig }
