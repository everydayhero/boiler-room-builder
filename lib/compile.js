const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

module.exports = (config, callback) => {
  const progress = new ProgressBarPlugin()
  const compiler = webpack(config)
  compiler.apply(progress)
  compiler.run((error, stats) => {
    if (error) throw error

    console.log(stats.toString({
      chunks: false,
      colors: true
    }))

    callback(stats)
  })
}
