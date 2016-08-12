const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const { keys } = Object

const fileLoaderTests = {
  eot: '\\.eot$',
  gif: '\\.gif$',
  jpg: '\\.(jpg|jpeg)$',
  png: '\\.png$',
  svg: '\\.svg$',
  ttf: '\\.ttf$',
  woff: '\\.woff'
}

const fileLoaderTest = (
  new RegExp(`(${keys(fileLoaderTests).map(
    (test) => fileLoaderTests[test]
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
    exclude: /node_modules/,
    query: {
      presets: [
        'es2015',
        'stage-0',
        'react'
      ]
    }
  },
  {
    test: fileLoaderTest,
    loader: 'file'
  }
]

const plugins = [new ProgressBarPlugin()]

module.exports = {
  stats: { children: false },
  module: { loaders },
  plugins
}
