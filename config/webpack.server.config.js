const nodeExternals = require('webpack-node-externals')

const entry = {
  server: './server.js'
}

const externals = [nodeExternals({
  whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i]
})]

const rules = [
  {
    test: /\.scss$/,
    use: 'null-loader'
  },
  {
    test: /\.css$/,
    use: 'null-loader'
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
