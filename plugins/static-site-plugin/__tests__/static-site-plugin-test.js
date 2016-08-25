const test = require('ava')
const StaticSitePlugin = require('../')

test('#constructor takes an app module', (t) => {
  const myApp = () => {}
  const staticSite = new StaticSitePlugin({ app: myApp })
  t.is(staticSite.app, myApp)
})

test.cb('#apply passes assets from stats to the passed app function', (t) => {
  t.plan(1)

  let passedAssets = []

  const myApp = ({ assets }) => {
    passedAssets = assets
    return (route) => (
      Promise.resolve({ result: '' })
    )
  }

  const mockCompilation = {
    assets: {},

    outputOptions: { publicPath: '/' },

    getStats () {
      return {
        toJson () {
          return {
            assetsByChunkName: {
              'main.css': 'main-123.css',
              'main.js': 'main-123.js'
            }
          }
        }
      }
    }
  }

  const mockCompiler = {
    plugin (_, callback) {
      callback(mockCompilation, () => {
        t.deepEqual(
          passedAssets,
          ['/main-123.css', '/main-123.js']
        )
        t.end()
      })
    }
  }

  const staticSite = new StaticSitePlugin({ app: myApp })

  staticSite.apply(mockCompiler)
})

test.cb('#apply adds a <route>/index.html per staticRoute on the return value of `app`', (t) => {
  t.plan(2)

  const myApp = () => {
    const runner = (route) => (
      Promise.resolve({ result: `ROUTE: ${route}` })
    )
    runner.staticRoutes = ['/', '/foo']
    return runner
  }

  const mockCompilation = {
    assets: {},

    outputOptions: { publicPath: '/' },

    getStats () {
      return {
        toJson () {
          return { assetsByChunkName: { } }
        }
      }
    }
  }

  const mockCompiler = {
    plugin (_, callback) {
      callback(mockCompilation, () => {
        t.is(
          mockCompilation.assets['index.html'].source(),
          'ROUTE: /'
        )
        t.is(
          mockCompilation.assets['foo/index.html'].source(),
          'ROUTE: /foo'
        )
        t.end()
      })
    }
  }

  const staticSite = new StaticSitePlugin({ app: myApp })

  staticSite.apply(mockCompiler)
})
