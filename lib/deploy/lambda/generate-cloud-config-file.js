const fs = require('fs')
const { join } = require('path')

module.exports = (
  file,
  { fnName, resultingFolder, basePath }
) => {
  const apiStage = (basePath === '/') ? 'prod' : basePath.replace(/\//g, '')
  const handlerFileContent = fs.readFileSync(`${__dirname}/templates/${file}`, 'utf8')
  const lambdaContent = handlerFileContent.replace(/AWS_ACCOUNT_ID/g, process.env.AWS_ACCOUNT_ID)
    .replace(/AWS_REGION/g, process.env.AWS_REGION)
    .replace(/AWS_IAM_ROLE/g, process.env.AWS_IAM_ROLE)
    .replace(/AWS_FN_NAME/g, fnName)
    .replace(/AWS_API_STAGE/g, apiStage)
  const filePath = join(resultingFolder, file)
  fs.writeFileSync(filePath, lambdaContent, 'utf8')
}
