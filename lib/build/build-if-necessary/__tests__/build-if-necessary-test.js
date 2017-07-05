const proxyquire = require('proxyquire')
const assert = require('assert')
const fs = require('fs')
const { join } = require('path')
const buildResultFilename = require('../../build-result-filename')

describe('#buildIfNecessary', () => {
  it('calls build with correct parameters if cannot find .brb_build.json', (done) => {
    const originalConfigs = {
      serverConfig: { foo: 'bar' },
      clientConfig: { foo: 'baz' }
    }
    const originalCb = () => 'cb_passed'
    const buildIfNecessary = proxyquire.load('../',
      {
        '../index': (configs, callback) => {
          assert.deepEqual(configs, originalConfigs)
          assert.equal(callback(), 'cb_passed')
          done()
        }
      }
    )

    const {serverConfig, clientConfig} = originalConfigs
    const outputDir = __dirname
    buildIfNecessary({serverConfig, clientConfig, outputDir}, originalCb)
  })

  it('correctly returns the app and assets from json file if exists', (done) => {
    const buildIfNecessary = require('../')
    const outputDir = join(__dirname, 'support')
    const appPath = join(outputDir, 'server.js')
    const buildFile = join(outputDir, buildResultFilename)
    const buildResult = {app_path: appPath, assets: ['asset1', 'asset2']}
    fs.writeFileSync(buildFile, JSON.stringify(buildResult), 'utf8')

    buildIfNecessary({serverConfig: {}, clientConfig: {}, outputDir}, ({app, assets}) => {
      assert.equal(app, 'server_app')
      assert.deepEqual(assets, ['asset1', 'asset2'])
      fs.unlinkSync(buildFile)
      done()
    })
  })
})
