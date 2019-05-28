const entry = {
  server: './server'
}

const rules = [
  {
    test: /\.css$/,
    use: 'null-loader'
  }
]

module.exports = {
  entry,
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    filename: 'server.js'
  },
  module: { rules },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
