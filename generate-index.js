const { join } = require('path')
const { writeFile } = require('fs')

module.exports = (outputDir, renderDocument) => {
  const html = renderDocument()

  writeFile(join(outputDir, 'index.html'), html, (error) => {
    if (error) throw error
  })
}

