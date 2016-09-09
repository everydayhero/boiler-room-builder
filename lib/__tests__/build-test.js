const { mockpack, defaultFileStructure } = require('../../tests/helpers/mockpack.js')
const test = require('ava')
const proxyquire = require('proxyquire')

const defaultProxyOptions = (fileSystem) => {
  const fakeStaticSiteGenerator = () => ({ apply: function () {} })
  const fakeAppFromStats = () => () => {}

    return {
      webpack: mockpack(fileSystem),
      '../plugins/static-site-plugin': fakeStaticSiteGenerator,
      './app-from-stats': fakeAppFromStats
    }
}

const setup = (proxyOptions, fileSystem) => {
  const fs = fileSystem()
  const build = proxyquire(
    '../build',
    proxyOptions(fs)
  )

  return { build , fs }
}

test("run the test", (t) => {
  const { build } = setup(defaultProxyOptions, defaultFileStructure)
  const params = {
    output: { path: '/dist' },
    entry: './client.js',
    context: '/source',
  }

  build({serverConfig: params, clientConfig: params})
})
