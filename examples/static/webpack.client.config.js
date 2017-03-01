const { DefinePlugin } = require('webpack')

module.exports = {
  plugins: [
    new DefinePlugin({
      'process.env.BASE_PATH': `'${process.env.BASE_PATH || ''}'`
    })
  ]
}
