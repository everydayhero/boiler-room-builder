const { join } = require('path')
const { writeFile } = require('fs')
const { CLIENT_OUTPUT_DIR } = require('./constants')

module.exports = (renderDocument) => {
  const html = renderDocument()

  writeFile(join(CLIENT_OUTPUT_DIR, 'index.html'), html, (error) => {
    if (error) throw error
  })
}

