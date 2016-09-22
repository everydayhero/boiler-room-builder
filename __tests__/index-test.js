const assert = require('assert')
const proxyquire = require('proxyquire')
const { join } = require('path')

it(`
  when action is "build", and no other options are pased,
  build is called with a serverConfig and clientConfig
  containing a default output.path
`, () => {
  let serverOutputPath = ''
  let clientOutputPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverOutputPath = serverConfig.output.path
      clientOutputPath = clientConfig.output.path
    }
  })

  brb({ action: 'build' })

  assert(join(process.cwd(), '/dist/') === serverOutputPath)
  assert(join(process.cwd(), '/dist/') === clientOutputPath)
})

it(`
  when action is "build", and an absolute inputDir option is passed,
  build is called with a serverConfig and clientConfig
  containing it as the output.path
`, () => {
  let serverOutputPath = ''
  let clientOutputPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverOutputPath = serverConfig.output.path
      clientOutputPath = clientConfig.output.path
    }
  })

  brb({ action: 'build', outputDir: '/foobar/' })

  assert('/foobar/' === serverOutputPath)
  assert('/foobar/' === clientOutputPath)
})

it(`
  when action is "build", and no other options are pased,
  build is called with a serverConfig and clientConfig
  containing a default context
`, () => {
  let serverContext = ''
  let clientContext = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverContext = serverConfig.context
      clientContext = clientConfig.context
    }
  })

  brb({ action: 'build' })

  assert(join(process.cwd(), '/source') === serverContext)
  assert(join(process.cwd(), '/source') === clientContext)
})

it(`
  when action is "build", and an absolute outputDir option is passed,
  build is called with a serverConfig and clientConfig
  containing it as the context
`, () => {
  let serverContext = ''
  let clientContext = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverContext = serverConfig.context
      clientContext = clientConfig.context
    }
  })

  brb({ action: 'build', inputDir: '/foobaz/' })

  assert('/foobaz/' === serverContext)
  assert('/foobaz/' === clientContext)
})

it(`
  when action is "build", and a basePath option is passed,
  build is called with a serverConfig and clientConfig
  containg it as output.publicPath
`, () => {
  let serverPublicPath = ''
  let clientPublicPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverPublicPath = serverConfig.output.publicPath
      clientPublicPath = clientConfig.output.publicPath
    }
  })

  brb({ action: 'build', basePath: '/foobaz/' })

  assert('/foobaz/', serverPublicPath)
  assert('/foobaz/', clientPublicPath)
})

it(`
  when action is "build" and a sharedConfig.output.path option is passed,
  build is called with serverConfig and clientConfig
  still respecting the outputDir option
`, () => {
  let serverOutputPath = ''
  let clientOutputPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverOutputPath = serverConfig.output.path
      clientOutputPath = clientConfig.output.path
    }
  })

  brb({
    action: 'build',
    outputDir: '/foobar/',
    sharedConfig: { output: { path: '/WOOT/' } }
  })

  assert('/foobar/' === serverOutputPath)
  assert('/foobar/' === clientOutputPath)
})

it(`
  when action is "build" and a serverConfig.output.path option is passed,
  build is called with serverConfig still respecting the outputDir option
`, () => {
  let serverOutputPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig }) => {
      serverOutputPath = serverConfig.output.path
    }
  })

  brb({
    action: 'build',
    outputDir: '/foobar/',
    serverConfig: { output: { path: '/WOOT/' } }
  })

  assert('/foobar/' === serverOutputPath)
})

it(`
  when action is "build" and a serverConfig.output.path option is passed,
  build is called with clientConfig still respecting the outputDir option
`, () => {
  let clientOutputPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ clientConfig }) => {
      clientOutputPath = clientConfig.output.path
    }
  })

  brb({
    action: 'build',
    outputDir: '/foobar/',
    clientConfig: { output: { path: '/WOOT/' } }
  })

  assert('/foobar/' === clientOutputPath)
})

it(`
  when action is "build" and a sharedConfig.context option is passed,
  build is called with serverConfig and clientConfig
  still respecting the inputDir option
`, () => {
  let serverContext = ''
  let clientContext = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverContext = serverConfig.context
      clientContext = clientConfig.context
    }
  })

  brb({
    action: 'build',
    inputDir: '/foobar/',
    sharedConfig: { context: '/WOOT/' }
  })

  assert('/foobar/' === serverContext)
  assert('/foobar/' === clientContext)
})

it(`
  when action is "build" and a serverConfig.context option is passed,
  build is called with serverConfig still respecting the inputDir option
`, () => {
  let serverContext = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig }) => {
      serverContext = serverConfig.context
    }
  })

  brb({
    action: 'build',
    inputDir: '/foobar/',
    serverConfig: { context: '/WOOT/' }
  })

  assert('/foobar/' === serverContext)
})

it(`
  when action is "build" and a clientConfig.context option is passed,
  build is called with clientConfig still respecting the inputDir option
`, () => {
  let clientContext = ''

  const brb = proxyquire('../', {
    './lib/build': ({ clientConfig }) => {
      clientContext = clientConfig.context
    }
  })

  brb({
    action: 'build',
    inputDir: '/foobar/',
    clientConfig: { context: '/WOOT/' }
  })

  assert('/foobar/' === clientContext)
})

it(`
  when action is build and a sharedConfig option is passed containing loaders,
  build is called with a clientConfig and a serverConfig
  containing those loaders
`, () => {
  let clientLoaders = []
  let serverLoaders = []

  const brb = proxyquire('../', {
    './lib/build': ({ clientConfig, serverConfig }) => {
      clientLoaders = clientConfig.module.loaders
      serverLoaders = serverConfig.module.loaders
    }
  })

  brb({
    action: 'build',
    sharedConfig: {
      module: {
        loaders: [
          { loader: 'my-special-loader', it: /.foo$/ },
          { loader: 'my-other-special-loader', it: /.bar$/ }
        ]
      }
    }
  })

  assert(clientLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(clientLoaders.find((l) => l.loader === 'my-other-special-loader'))

  assert(serverLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(serverLoaders.find((l) => l.loader === 'my-other-special-loader'))
})

it(`
  when action is build and a clientConfig option is passed containing loaders,
  build is called with a clientConfig containing those loaders
`, () => {
  let clientLoaders = []
  let serverLoaders = []

  const brb = proxyquire('../', {
    './lib/build': ({ clientConfig, serverConfig }) => {
      clientLoaders = clientConfig.module.loaders
      serverLoaders = serverConfig.module.loaders
    }
  })

  brb({
    action: 'build',
    clientConfig: {
      module: {
        loaders: [
          { loader: 'my-special-loader', it: /.foo$/ },
          { loader: 'my-other-special-loader', it: /.bar$/ }
        ]
      }
    }
  })

  assert(clientLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(clientLoaders.find((l) => l.loader === 'my-other-special-loader'))

  assert(!serverLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(!serverLoaders.find((l) => l.loader === 'my-other-special-loader'))
})

it(`
  when action is build and a serverConfig option is passed containing loaders,
  build is called with a serverConfig containing those loaders
`, () => {
  let clientLoaders = []
  let serverLoaders = []

  const brb = proxyquire('../', {
    './lib/build': ({ clientConfig, serverConfig }) => {
      clientLoaders = clientConfig.module.loaders
      serverLoaders = serverConfig.module.loaders
    }
  })

  brb({
    action: 'build',
    serverConfig: {
      module: {
        loaders: [
          { loader: 'my-special-loader', it: /.foo$/ },
          { loader: 'my-other-special-loader', it: /.bar$/ }
        ]
      }
    }
  })

  assert(!clientLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(!clientLoaders.find((l) => l.loader === 'my-other-special-loader'))

  assert(serverLoaders.find((l) => l.loader === 'my-special-loader'))
  assert(serverLoaders.find((l) => l.loader === 'my-other-special-loader'))
})
