const test = require('ava')
const proxyquire = require('proxyquire')
const { join } = require('path')

test(`
  when action is "build", and no other options are pased,
  build is called with a serverConfig and clientConfig
  containing a default output.path
`, (t) => {
  let serverOutputPath = ''
  let clientOutputPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverOutputPath = serverConfig.output.path
      clientOutputPath = clientConfig.output.path
    }
  })

  brb({ action: 'build' })

  t.is(join(process.cwd(), '/dist/'), serverOutputPath)
  t.is(join(process.cwd(), '/dist/'), clientOutputPath)
})

test(`
  when action is "build", and an absolute inputDir option is passed,
  build is called with a serverConfig and clientConfig
  containing it as the output.path
`, (t) => {
  let serverOutputPath = ''
  let clientOutputPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverOutputPath = serverConfig.output.path
      clientOutputPath = clientConfig.output.path
    }
  })

  brb({ action: 'build', outputDir: '/foobar/' })

  t.is('/foobar/', serverOutputPath)
  t.is('/foobar/', clientOutputPath)
})

test(`
  when action is "build", and no other options are pased,
  build is called with a serverConfig and clientConfig
  containing a default context
`, (t) => {
  let serverContext = ''
  let clientContext = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverContext = serverConfig.context
      clientContext = clientConfig.context
    }
  })

  brb({ action: 'build' })

  t.is(join(process.cwd(), '/source'), serverContext)
  t.is(join(process.cwd(), '/source'), clientContext)
})

test(`
  when action is "build", and an absolute outputDir option is passed,
  build is called with a serverConfig and clientConfig
  containing it as the context
`, (t) => {
  let serverContext = ''
  let clientContext = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverContext = serverConfig.context
      clientContext = clientConfig.context
    }
  })

  brb({ action: 'build', inputDir: '/foobaz/' })

  t.is('/foobaz/', serverContext)
  t.is('/foobaz/', clientContext)
})

test(`
  when action is "build", and a basePath option is passed,
  build is called with a serverConfig and clientConfig
  containg it as output.publicPath
`, (t) => {
  let serverPublicPath = ''
  let clientPublicPath = ''

  const brb = proxyquire('../', {
    './lib/build': ({ serverConfig, clientConfig }) => {
      serverPublicPath = serverConfig.output.publicPath
      clientPublicPath = clientConfig.output.publicPath
    }
  })

  brb({ action: 'build', basePath: '/foobaz/' })

  t.is('/foobaz/', serverPublicPath)
  t.is('/foobaz/', clientPublicPath)
})

test(`
  when action is "build" and a sharedConfig.output.path option is passed,
  build is called with serverConfig and clientConfig
  still respecting the outputDir option
`, (t) => {
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

  t.is('/foobar/', serverOutputPath)
  t.is('/foobar/', clientOutputPath)
})

test(`
  when action is "build" and a serverConfig.output.path option is passed,
  build is called with serverConfig still respecting the outputDir option
`, (t) => {
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

  t.is('/foobar/', serverOutputPath)
})

test(`
  when action is "build" and a serverConfig.output.path option is passed,
  build is called with clientConfig still respecting the outputDir option
`, (t) => {
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

  t.is('/foobar/', clientOutputPath)
})

test(`
  when action is "build" and a sharedConfig.context option is passed,
  build is called with serverConfig and clientConfig
  still respecting the inputDir option
`, (t) => {
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

  t.is('/foobar/', serverContext)
  t.is('/foobar/', clientContext)
})

test(`
  when action is "build" and a serverConfig.context option is passed,
  build is called with serverConfig still respecting the inputDir option
`, (t) => {
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

  t.is('/foobar/', serverContext)
})

test(`
  when action is "build" and a clientConfig.context option is passed,
  build is called with clientConfig still respecting the inputDir option
`, (t) => {
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

  t.is('/foobar/', clientContext)
})

test(`
  when action is build and a sharedConfig option is passed containing loaders,
  build is called with a clientConfig and a serverConfig
  containing those loaders
`, (t) => {
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
          { loader: 'my-special-loader', test: /.foo$/ },
          { loader: 'my-other-special-loader', test: /.bar$/ }
        ]
      }
    }
  })

  t.truthy(clientLoaders.find((l) => l.loader === 'my-special-loader'))
  t.truthy(clientLoaders.find((l) => l.loader === 'my-other-special-loader'))

  t.truthy(serverLoaders.find((l) => l.loader === 'my-special-loader'))
  t.truthy(serverLoaders.find((l) => l.loader === 'my-other-special-loader'))
})

test(`
  when action is build and a clientConfig option is passed containing loaders,
  build is called with a clientConfig containing those loaders
`, (t) => {
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
          { loader: 'my-special-loader', test: /.foo$/ },
          { loader: 'my-other-special-loader', test: /.bar$/ }
        ]
      }
    }
  })

  t.truthy(clientLoaders.find((l) => l.loader === 'my-special-loader'))
  t.truthy(clientLoaders.find((l) => l.loader === 'my-other-special-loader'))

  t.truthy(!serverLoaders.find((l) => l.loader === 'my-special-loader'))
  t.truthy(!serverLoaders.find((l) => l.loader === 'my-other-special-loader'))
})

test(`
  when action is build and a serverConfig option is passed containing loaders,
  build is called with a serverConfig containing those loaders
`, (t) => {
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
          { loader: 'my-special-loader', test: /.foo$/ },
          { loader: 'my-other-special-loader', test: /.bar$/ }
        ]
      }
    }
  })

  t.truthy(!clientLoaders.find((l) => l.loader === 'my-special-loader'))
  t.truthy(!clientLoaders.find((l) => l.loader === 'my-other-special-loader'))

  t.truthy(serverLoaders.find((l) => l.loader === 'my-special-loader'))
  t.truthy(serverLoaders.find((l) => l.loader === 'my-other-special-loader'))
})
