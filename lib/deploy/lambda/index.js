const fs = require('fs')
const { join, basename } = require('path')
const getPreviousResult = require('../../build-if-necessary/get-previous-result')

class LambdaDeploy {
  constructor (dir) {
    this.dir = dir
    this.brbBuildFile = join(dir, '.brb_build.json')
  }

  get buildDone () {
    return fs.existsSync(this.brbBuildFile)
  }

  addLambdaFn () {
    return new Promise((resolve) => {
      getPreviousResult(this.brbBuildFile, ({assets, app_path}) => {
        const appBasename = basename(app_path)
        const handlerFileContent = fs.readFileSync(`${__dirname}/lambda_template`, 'utf8')
        const lambdaContent = handlerFileContent.replace(/ASSETS/, JSON.stringify(assets))
          .replace(/SERVER_FILE/, `./${appBasename}`)
          .replace(/STATIC_DIR/, '.')
          .replace(/BASE_PATH/, '/')
        const lambdaFilePath = join(this.dir, 'lambda.js')
        fs.writeFileSync(lambdaFilePath, lambdaContent, 'utf8')
        resolve(lambdaFilePath)
      })
    })
  }
}

module.exports = (dir) => {
  const lambdaHandler = new LambdaDeploy(dir)

  if (lambdaHandler.buildDone) {
    lambdaHandler.addLambdaFn()
  }
}
