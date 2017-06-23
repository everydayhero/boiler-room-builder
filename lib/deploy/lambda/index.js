const archiver = require('archiver')
const fs = require('fs')
const { join, basename } = require('path')
const getPreviousResult = require('../../build/build-if-necessary/get-previous-result')
const buildResultFilename = require('../../build/build-result-filename')

class LambdaDeploy {
  constructor ({ dir, basePath }) {
    this.dir = dir
    this.brbBuildFile = join(dir, buildResultFilename)
    this.basePath = basePath
  }

  get buildDone () {
    return fs.existsSync(this.brbBuildFile)
  }

  addLambdaFn () {
    return new Promise((resolve) => {
      getPreviousResult(this.brbBuildFile, ({assets, app_path}) => {
        this.appBasename = basename(app_path)
        const handlerFileContent = fs.readFileSync(`${__dirname}/lambda_template`, 'utf8')
        const lambdaContent = handlerFileContent.replace(/ASSETS/, JSON.stringify(assets))
          .replace(/SERVER_FILE/, `./${this.appBasename}`)
          .replace(/BASE_PATH/, this.basePath)
        resolve({lambdaContent, app_path})
      })
    })
  }

  createArchive ({lambdaContent, app_path}) {
    const archivePath = join(process.cwd(), 'lambda.zip')
    const archive = archiver('zip')
    const output = fs.createWriteStream(archivePath)

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes')
      console.log('archiver has been finalized and the output file descriptor has closed.')
    })

    archive.on('error', (err) => {
      throw err
    })

    archive.pipe(output)

    archive.append(lambdaContent, { name: 'lambda.js' })

    archive.file(app_path, { name: 'server.js' })

    archive.glob('**/*', {
      cwd: join(process.cwd(), this.dir),
      dot: true,
      ignore: [buildResultFilename, this.appBasename]
    }, { prefix: 'public' })

    archive.glob('node_modules/**/*', {
      dot: true
    }, {})

    archive.finalize()
  }
}

module.exports = ({ dir, basePath }) => {
  const lambdaHandler = new LambdaDeploy({ dir, basePath })
  const createArchive = lambdaHandler.createArchive.bind(lambdaHandler)

  if (lambdaHandler.buildDone) {
    lambdaHandler.addLambdaFn().then(createArchive)
  }
}
