const { join } = require('path')
const standard = require('standard')

module.exports = ({
  inputDir = join(process.cwd(), 'source'),
  pattern = '**/*.js'
}) => {
  standard.lintFiles(join(inputDir, pattern), (error, result) => {
    if (error) throw error

    result.results.forEach(function ({ filePath, messages }) {
      messages.forEach(({ line = 0, column = 0, message }) => {
        console.log(
          `${filePath}:${line}:${column}: ${message}`
        )
      })
    })
  })
}
