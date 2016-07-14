const webpack = require('webpack')
const { join } = require('path')

module.exports = (env, callback) => {
  const config = require(join(process.cwd(), `webpack.${env}.config`))
  webpack(config).run((error, stats) => {
    if (error) throw error

    console.log(stats.toString({
      chunks: false,
      colors: true
    }))

    callback(stats)
  })
}
