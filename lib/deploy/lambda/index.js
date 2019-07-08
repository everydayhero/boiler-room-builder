const archiver = require('archiver')
const { exec } = require('child_process')
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
    const fileExist = fs.existsSync(this.brbBuildFile)
    if (!fileExist) { console.log('Please Build First') }
    return fs.existsSync(this.brbBuildFile)
  }

  get envSet () {
    let isSet = true
    if (!process.env.AWS_ACCOUNT_ID) {
      console.error('ERROR: Please set the AWS_ACCOUNT_ID environment variable')
      isSet = false
    }
    if (!process.env.AWS_REGION) {
      console.error('ERROR: Please set AWS_REGION environment variable')
      isSet = false
    }
    if (!process.env.AWS_IAM_ROLE) {
      console.error('ERROR: Please set AWS_IAM_ROLE environment variable')
      isSet = false
    }
    if (!this.dir) {
      console.error('ERROR: Please provide the directory of your build')
      isSet = false
    }
    if (!this.fnName) {
      console.error('ERROR: Please specify how you would like the lambda to be called (--fn-name)')
      isSet = false
    }
    if (!this.bucket) {
      console.error('ERROR: Please specify the bucket name where the lambda should be deployed (--bucket)')
      isSet = false
    }
    return isSet
  }

  addDependencies () {
    return new Promise((resolve, reject) => {
      const templatesDir = `${__dirname}/templates`
      const modulesDir = join(process.cwd(), '.lambda', 'node_modules')
      const command = `cd ${templatesDir} && yarn --modules-folder=${modulesDir} --non-interactive`
      exec(command, (err) => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  generateLambdaWrapper () {
    return new Promise((resolve) => {
      getPreviousResult(this.brbBuildFile, ({ assets, appPath }) => {
        this.appBasename = basename(appPath)
        const handlerFileContent = fs.readFileSync(`${__dirname}/templates/lambda_wrapper`, 'utf8')
        const lambdaContent = handlerFileContent.replace(/ASSETS/, JSON.stringify(assets))
          .replace(/SERVER_FILE/, `./${this.appBasename}`)
          .replace(/BASE_PATH/, this.basePath)
        resolve({ lambdaContent, appPath })
      })
    })
  }

  createArchive ({ lambdaContent, appPath }) {
    return new Promise((resolve, reject) => {
      const resultingFolder = join(process.cwd(), '.lambda')
      mkdirp.sync(resultingFolder)
      const archivePath = join(resultingFolder, 'lambda.zip')
      const archive = archiver('zip')
      const output = fs.createWriteStream(archivePath)

      output.on('open', () => {
        console.log('Creating Archive to upload to S3 under', resultingFolder)
      })

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes')
        console.log('archiver has been finalized and the output file descriptor has closed.')
        resolve(resultingFolder)
      })

      archive.on('error', (err) => {
        reject(err)
      })

      archive.pipe(output)

      archive.append(lambdaContent, { name: 'lambda.js' })

      archive.file(appPath, { name: 'server.js' })
      archive.file(`${__dirname}/../../prod-server/app.js`, { name: 'app.js' })

      archive.glob('**/*', {
        cwd: join(process.cwd(), this.dir),
        dot: true,
        ignore: [buildResultFilename, this.appBasename]
      }, { prefix: 'public' })

      archive.glob('node_modules/**/*', {
        cwd: join(process.cwd(), '.lambda'),
        dot: true
      })

      archive.finalize()
    })
  }

  generateCloudConfigurationFiles (resultingFolder) {
    ['cloudformation.yaml', 'simple-proxy-api.yaml'].forEach((file) => {
      generateCloudConfigFile(file, {
        fnName: this.fnName,
        basePath: this.basePath,
        resultingFolder
      })
    })
    return resultingFolder
  }

  upload (resultingFolder) {
    return new Promise((resolve, reject) => {
      let args = ['cloudformation',
        'package',
        '--template=./cloudformation.yaml',
        `--s3-bucket=${this.bucket}`,
        '--output-template=packaged-sam.yaml',
        `--region=${process.env.AWS_REGION}`
      ]
      if (this.prefix) { args.push(`--s3-prefix=${this.prefix}`) }
      const S3Upload = spawn('aws', args, { stdio: 'inherit', cwd: resultingFolder })
      S3Upload.on('exit', (code) => {
        if (code === 0) {
          resolve(resultingFolder)
        } else {
          console.error('S3 upload failed')
          reject()
        }
      })
    })
  }

  deploy (resultingFolder) {
    return new Promise((resolve, reject) => {
      const args = ['cloudformation',
        'deploy',
        '--template-file=packaged-sam.yaml',
        `--stack-name=${this.fnName}`,
        '--capabilities=CAPABILITY_IAM',
        `--region=${process.env.AWS_REGION}`
      ]
      const deployFn = spawn('aws', args, { stdio: 'inherit', cwd: resultingFolder })
      deployFn.on('exit', (code) => {
        if (code === 0) {
          resolve(resultingFolder)
        } else {
          console.error('Cloudformation deployment failed')
          reject()
        }
      })
    })
  }
}

module.exports = (dir, { basePath, fnName, bucket, prefix }) => {
  const lambdaHandler = new LambdaDeploy(dir, { basePath, fnName, bucket, prefix })
  const generateLambdaWrapper = lambdaHandler.generateLambdaWrapper.bind(lambdaHandler)
  const createArchive = lambdaHandler.createArchive.bind(lambdaHandler)
  const generateCloudConfigurationFiles = lambdaHandler.generateCloudConfigurationFiles.bind(lambdaHandler)
  const upload = lambdaHandler.upload.bind(lambdaHandler)
  const deploy = lambdaHandler.deploy.bind(lambdaHandler)

  if (lambdaHandler.buildDone && lambdaHandler.envSet) {
    lambdaHandler.addDependencies()
      .then(generateLambdaWrapper)
      .then(createArchive)
      .then(generateCloudConfigurationFiles)
      .then(upload)
      .then(deploy)
      .catch(() => process.exit(1))
  } else {
    process.exit(1)
  }
}
