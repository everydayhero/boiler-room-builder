const { mockpack, defaultFileStructure, defaultProxyOptions} = require('../../tests/helpers/mockpack.js')
const test = require('ava')
const proxyquire = require('proxyquire')

const myProxyOptions = ( ) => {
  const fakeStaticSiteGenerator = () => ({ apply: function () {} })
  const fakeAppFromStats = () => () => {}

  return Object.assign(
    {
      '../plugins/static-site-plugin': fakeStaticSiteGenerator,
      './app-from-stats': fakeAppFromStats
    },
    defaultProxyOptions()
  )
}

const setup = (proxyOptions, fileSystem) => {
  const fs = fileSystem()
  const build = proxyquire(
    '../build',
    proxyOptions()
  )

  return { build, fs }
}

test("run the test", (t) => {
  const { build, fs } = setup(myProxyOptions, defaultFileStructure)
  const params = {
    output: { path: '/dist' },
    entry: './client.js',
    context: '/source',
  }

  build({serverConfig: params, clientConfig: params})

  t.is(fs, 1)
})
