const {
  INPUT_DIR,
  PUBLIC_PATH
} = require('./constants')

const { keys } = Object

const FILE_LOADER_TESTS = {
  eot: '\\.eot$',
  gif: '\\.gif$',
  jpg: '\\.(jpg|jpeg)$',
  png: '\\.png$',
  svg: '\\.svg$',
  ttf: '\\.ttf$',
  woff: '\\.woff'
}

const FILE_LOADER_TEST = (
  new RegExp(`(${keys(FILE_LOADER_TESTS).map(
    (test) => FILE_LOADER_TESTS[test]
  ).join('|')})`)
)

const loaders = [
  {
    test: /\.json$/,
    loader: 'json'
  },
  {
    test: /\.js?$/,
    loader: 'babel',
    include: new RegExp(INPUT_DIR),
    query: {
      presets: [
        'es2015',
        'stage-0',
        'react'
      ]
    }
  },
  {
    test: FILE_LOADER_TEST,
    loader: 'file'
  }
]

module.exports = {
  stats: { children: false },
  context: INPUT_DIR,
  publicPath: PUBLIC_PATH,
  loaders,
  plugins: []
}
