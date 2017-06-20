const nodeExternals = require('webpack-node-externals')

const entry = {
  server: './server.js'
}

const externals = [nodeExternals({
  whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i]
})]

const rules = [
  {
    test: /\.css$/,
    loader: 'null-loader'
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
  module: { rules }
}
