const archiver = require('archiver')
const fs = require('fs')
const mkdirp = require('mkdirp')
const { join, basename } = require('path')
const { spawn } = require('child_process')
const getPreviousResult = require('../../build/build-if-necessary/get-previous-result')
const buildResultFilename = require('../../build/build-result-filename')
const generateCloudConfigFile = require('./generate-cloud-config-file')

class LambdaDeploy {
  constructor (dir, { basePath, fnName, bucket, prefix }) {
    this.dir = dir
    this.brbBuildFile = join(dir, buildResultFilename)
    this.basePath = basePath
    this.fnName = fnName
    this.bucket = bucket
    this.prefix = prefix
  }

  get buildDone () {
    return fs.existsSync(this.brbBuildFile)
  }

  generateLambdaWrapper () {
    return new Promise((resolve) => {
      getPreviousResult(this.brbBuildFile, ({assets, app_path}) => {
        this.appBasename = basename(app_path)
        const handlerFileContent = fs.readFileSync(`${__dirname}/templates/lambda_wrapper`, 'utf8')
        const lambdaContent = handlerFileContent.replace(/ASSETS/, JSON.stringify(assets))
          .replace(/SERVER_FILE/, `./${this.appBasename}`)
          .replace(/BASE_PATH/, this.basePath)
        resolve({lambdaContent, app_path})
      })
    })
  }

  createArchive ({lambdaContent, app_path}) {
    return new Promise((resolve, reject) => {
      const resultingFolder = join(process.cwd(), '.lambda')
      mkdirp.sync(resultingFolder)
      const archivePath = join(resultingFolder, 'lambda.zip')
      const archive = archiver('zip')
      const output = fs.createWriteStream(archivePath)

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes')
        console.log('archiver has been finalized and the output file descriptor has closed.')
        resolve(resultingFolder)
      })

      archive.on('error', (err) => {
        reject(err)
      })

      archive.pipe(output)

      archive.append(lambdaContent, {name: 'lambda.js'})

      archive.file(app_path, {name: 'server.js'})

      archive.glob('**/*', {
        cwd: join(process.cwd(), this.dir),
        dot: true,
        ignore: [buildResultFilename, this.appBasename]
      }, {prefix: 'public'})

      archive.glob('node_modules/**/*', {
        dot: true
      }, {})

      archive.finalize()
    })
  }

  generateCloudConfigurationFiles (resultingFolder) {
    ['cloudformation.yaml', 'simple-proxy-api.yaml'].forEach((file) => {
      generateCloudConfigFile(file, { fnName: this.fnName, resultingFolder })
    })
    return resultingFolder
  }

  upload (resultingFolder) {
    return new Promise((resolve) => {
      let args = ['cloudformation',
        'package',
        '--template=./cloudformation.yaml',
        `--s3-bucket=${this.bucket}`,
        '--output-template=packaged-sam.yaml',
        `--region=${process.env.AWS_REGION}`
      ]
      if (this.prefix) { args.push(`--s3-prefix=${this.prefix}`) }
      const S3Upload = spawn("aws", args, {stdio: 'inherit', cwd: resultingFolder})
      S3Upload.on('exit', (code, signal) => {
        resolve(resultingFolder)
      })
    })
  }

  deploy (resultingFolder) {
    return new Promise((resolve) => {
      const args = ['cloudformation',
        'deploy',
        '--template-file=packaged-sam.yaml',
        `--stack-name=${this.fnName}`,
        '--capabilities=CAPABILITY_IAM',
        `--region=${process.env.AWS_REGION}`
      ]
      const deployFn = spawn("aws", args, {stdio: 'inherit', cwd: resultingFolder})
      deployFn.on('exit', (code, signal) => {
        resolve(resultingFolder)
      })
    })
  }
}

module.exports = (dir, { basePath, fnName, bucket, prefix }) => {
  const lambdaHandler = new LambdaDeploy(dir, { basePath, fnName, bucket, prefix })
  const createArchive = lambdaHandler.createArchive.bind(lambdaHandler)
  const generateCloudConfigurationFiles = lambdaHandler.generateCloudConfigurationFiles.bind(lambdaHandler)
  const upload = lambdaHandler.upload.bind(lambdaHandler)
  const deploy = lambdaHandler.deploy.bind(lambdaHandler)

  if (lambdaHandler.buildDone) {
    lambdaHandler.generateLambdaWrapper()
      .then(createArchive)
      .then(generateCloudConfigurationFiles)
      .then(upload)
      .then(deploy)
  }
}
