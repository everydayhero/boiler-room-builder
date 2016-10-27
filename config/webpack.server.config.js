const nodeExternals = require('webpack-node-externals')

const entry = {
  server: './server.js'
}

const externals = [nodeExternals({
  whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i]
})]

const loaders = [
  {
    test: /\.scss$/,
    loader: 'null'
  },
  {
    test: /\.css$/,
    loader: 'null'
  }
]

module.exports = {
  entry,
  target: 'node',
  externals,
  output: {
    libraryTarget: 'commonjs',
    filename: 'server.js'
  },
  module: { loaders }
}
