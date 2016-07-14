const {
  INPUT_DIR,
  PUBLIC_PATH
} = require('./constants')

const loaders = [
  {
    test: /\.json$/,
    loader: 'json'
  },
  {
    test: /\.js?$/,
    loader: 'babel',
    query: {
      presets: [
        'es2015',
        'stage-0',
        'react'
      ]
    }
  },
  {
    test: /(\.png|\.jpg|\.svg|\.eot|\.ttf|\.woff)$/,
    loader: 'file-loader'
  }
]

module.exports = {
  stats: { children: false },
  context: INPUT_DIR,
  publicPath: PUBLIC_PATH,
  loaders,
  plugins: []
}
