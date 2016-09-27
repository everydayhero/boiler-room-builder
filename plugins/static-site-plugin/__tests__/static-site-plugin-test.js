const assert = require('assert')
const StaticSitePlugin = require('../')

it('#constructor takes an app module', () => {
  const myApp = () => {}
  const staticSite = new StaticSitePlugin({ app: myApp })
  assert.equal(staticSite.app, myApp)
})

it('#apply passes assets from stats to the passed app function', (done) => {
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
        assert.deepEqual(
          passedAssets,
          ['/main-123.css', '/main-123.js']
        )
        done()
      })
    }
  }

  const staticSite = new StaticSitePlugin({ app: myApp })

  staticSite.apply(mockCompiler)
})

it('#apply adds a <route>/index.html per staticRoute on the return value of `app`', (done) => {
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
        assert.equal(
          mockCompilation.assets['index.html'].source(),
          'ROUTE: /'
        )
        assert.equal(
          mockCompilation.assets['foo/index.html'].source(),
          'ROUTE: /foo'
        )
        done()
      })
    }
  }

  const staticSite = new StaticSitePlugin({ app: myApp })

  staticSite.apply(mockCompiler)
})
