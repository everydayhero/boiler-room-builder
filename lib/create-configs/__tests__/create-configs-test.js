const assert = require('assert')
const { join } = require('path')

const createConfigs = require('../')

it(`
  when no options are passed,
  a serverConfig and clientConfig is returned
  containing a default output.path
`, () => {
  const { serverConfig, clientConfig } = createConfigs()
  const { output: { path: clientOutputPath } } = clientConfig
  const { output: { path: serverOutputPath } } = serverConfig

  assert.equal(join(process.cwd(), '/dist'), serverOutputPath)
  assert.equal(join(process.cwd(), '/dist'), clientOutputPath)
})

it(`
  when an absolute outputDir option is passed,
  a serverConfig and clientConfig is returned
  containing it as the output.path
`, () => {
  const { serverConfig, clientConfig } = createConfigs({ outputDir: '/foobar/' })
  const { output: { path: clientOutputPath } } = clientConfig
  const { output: { path: serverOutputPath } } = serverConfig

  assert.equal('/foobar/', serverOutputPath)
  assert.equal('/foobar/', clientOutputPath)
})

it(`
  when no options are passed,
  a serverConfig and clientConfig is returned
  containing a default context
`, () => {
  const { serverConfig, clientConfig } = createConfigs()
  const { context: clientContext } = clientConfig
  const { context: serverContext } = serverConfig

  assert.equal(join(process.cwd(), '/source'), serverContext)
  assert.equal(join(process.cwd(), '/source'), clientContext)
})

it(`
  when an absolute inputDir option is passed,
  a serverConfig and clientConfig is returned
  containing it as the context
`, () => {
  const { serverConfig, clientConfig } = createConfigs({ inputDir: '/foobaz/' })
  const { context: clientContext } = clientConfig
  const { context: serverContext } = serverConfig

  assert.equal('/foobaz/', serverContext)
  assert.equal('/foobaz/', clientContext)
})

it(`
  when a basePath option is passed,
  a serverConfig and clientConfig is returned
  containing it as output.publicPath
`, () => {
  const { serverConfig, clientConfig } = createConfigs({ basePath: '/foobaz/' })
  const { output: { publicPath: clientPublicPath } } = clientConfig
  const { output: { publicPath: serverPublicPath } } = serverConfig

  assert.equal('/foobaz/', serverPublicPath)
  assert.equal('/foobaz/', clientPublicPath)
})

it(`
  when a sharedConfig.output.path option is passed,
  the serverConfig and clientConfig
  still respects the outputDir option
`, () => {
  const { serverConfig, clientConfig } = createConfigs({
    outputDir: '/foobar/',
    sharedConfig: { output: { path: '/WOOT/' } }
  })
  const { output: { path: serverOutputPath } } = serverConfig
  const { output: { path: clientOutputPath } } = clientConfig

  assert.equal('/foobar/', serverOutputPath)
  assert.equal('/foobar/', clientOutputPath)
})

it(`
  when a serverConfig.output.path option is passed,
  the serverConfig still respects the outputDir option
`, () => {
  const { serverConfig } = createConfigs({
    outputDir: '/foobar/',
    serverConfig: { output: { path: '/WOOT/' } }
  })
  const { output: { path: serverOutputPath } } = serverConfig

  assert.equal('/foobar/', serverOutputPath)
})

it(`
  when a serverConfig.output.path option is passed,
  the clientConfig still respects the outputDir option
`, () => {
  const { clientConfig } = createConfigs({
    outputDir: '/foobar/',
    clientConfig: { output: { path: '/WOOT/' } }
  })
  const { output: { path: clientOutputPath } } = clientConfig

  assert.equal('/foobar/', clientOutputPath)
})

it(`
  when a sharedConfig.context option is passed,
  the serverConfig and clientConfig
  still respects the inputDir option
`, () => {
  const { clientConfig, serverConfig } = createConfigs({
    inputDir: '/foobar/',
    sharedConfig: { context: '/WOOT/' }
  })
  const { context: clientContext } = clientConfig
  const { context: serverContext } = serverConfig

  assert.equal('/foobar/', serverContext)
  assert.equal('/foobar/', clientContext)
})

it(`
  when a serverConfig.context option is passed,
  the serverConfig still respects the inputDir option
`, () => {
  const { serverConfig } = createConfigs({
    inputDir: '/foobar/',
    serverConfig: { context: '/WOOT/' }
  })
  const { context: serverContext } = serverConfig

  assert.equal('/foobar/', serverContext)
})

it(`
  when a clientConfig.context option is passed,
  the clientConfig still respects the inputDir option
`, () => {
  const { clientConfig } = createConfigs({
    inputDir: '/foobar/',
    clientConfig: { context: '/WOOT/' }
  })
  const { context: clientContext } = clientConfig

  assert.equal('/foobar/', clientContext)
})

it(`
  when a sharedConfig option is passed containing loaders,
  a clientConfig and a serverConfig is returned
  containing those loaders
`, () => {
  const { serverConfig, clientConfig } = createConfigs({
    shared: {
      module: {
        loaders: [
          { loader: 'my-special-loader', test: /.foo$/ },
          { loader: 'my-other-special-loader', test: /.bar$/ }
        ]
      }
    }
  })

  const { module: { loaders: clientLoaders } } = clientConfig
  const { module: { loaders: serverLoaders } } = serverConfig

  assert(clientLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(clientLoaders.find((l) => l.loader === 'my-other-special-loader'))

  assert(serverLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(serverLoaders.find((l) => l.loader === 'my-other-special-loader'))
})

it(`
  when a sharedConfig option is passed containing loaders,
  and one of those loaders has a test that overrides a default loader,
  a clientConfig and a serverConfig is returned
  containing the overridden loader
`, () => {
  const { serverConfig, clientConfig } = createConfigs({
    shared: {
      module: {
        loaders: [
          { loader: 'my-special-svg-loader', test: /\.svg$/ }
        ]
      }
    }
  })
  const { module: { loaders: clientLoaders } } = clientConfig
  const { module: { loaders: serverLoaders } } = serverConfig

  assert(clientLoaders.find(l => l.loader === 'my-special-svg-loader'))
  assert(clientLoaders.filter(l => l.test.test('foo.svg')).length === 1)

  assert(serverLoaders.find(l => l.loader === 'my-special-svg-loader'))
  assert(serverLoaders.filter(l => l.test.test('foo.svg')).length === 1)
})

it(`
  when a clientConfig option is passed containing loaders,
  a clientConfig is returned containing those loaders
`, () => {
  const { clientConfig } = createConfigs({
    client: {
      module: {
        loaders: [
          { loader: 'my-special-loader', test: /.foo$/ },
          { loader: 'my-other-special-loader', test: /.bar$/ }
        ]
      }
    }
  })

  const { module: { loaders: clientLoaders } } = clientConfig

  assert(clientLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(clientLoaders.find((l) => l.loader === 'my-other-special-loader'))
})

it(`
  when a serverConfig option is passed containing loaders,
  then a serverConfig is returned containing those loaders
`, () => {
  const { serverConfig } = createConfigs({
    server: {
      module: {
        loaders: [
          { loader: 'my-special-loader', test: /.foo$/ },
          { loader: 'my-other-special-loader', test: /.bar$/ }
        ]
      }
    }
  })

  const { module: { loaders: serverLoaders } } = serverConfig

  assert(serverLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(serverLoaders.find((l) => l.loader === 'my-other-special-loader'))
})
