const webpack = require('webpack')

module.exports = (config, callback) => {
  webpack(config).run((error, stats) => {
    if (error) throw error

    console.log(stats.toString({
      chunks: false,
      colors: true
    }))

    callback(stats)
  })
}
