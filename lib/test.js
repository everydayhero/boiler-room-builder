const Mocha = require('mocha')
const glob = require('glob')
const { join } = require('path')
const clear = require('clear')

const { utils } = Mocha

module.exports = ({
  inputDir = join(process.cwd(), 'source'),
  sharedConfigPath,
  serverConfigPath,
  pattern = '**/__tests__/*-test.js',
  watch = false
}) => {
  require('./webpack-register')(
    sharedConfigPath,
    serverConfigPath
  )
  const mocha = new Mocha({ reporter: 'list' })
  mocha.ui('bdd')

  glob(join(inputDir, pattern), (error, files) => {
    if (error) throw error

    files.forEach((file) => {
      mocha.addFile(file)
    })

    if (watch) {
      mocha.run(() => {
        utils.watch(files, () => {
          clear()

          files.forEach((file) => {
            delete require.cache[file]
            mocha.addFile(file)
          })

          mocha.suite = mocha.suite.clone()
          mocha.suite.ctx = new Mocha.Context()
          mocha.ui('bdd')
          mocha.run()
        })
      })
    } else {
      mocha.run((report) => {
        process.on('exit', () => {
          process.exit(report)
        })
      })
    }
  })
}
