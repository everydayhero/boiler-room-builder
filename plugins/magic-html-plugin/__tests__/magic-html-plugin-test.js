const assert = require('assert')
const MagicHTMLPlugin = require('../')
const defaultRenderDocument = require('../../../lib/default-render-document')

it('#constructor takes a render function option', () => {
  const mahRender = () => 'Foo'
  const magicHTML = new MagicHTMLPlugin({ render: mahRender })
  assert.equal(magicHTML.render, mahRender)
})

it('#contructor defaults the render option to defaultRenderDocument', () => {
  const magicHTML = new MagicHTMLPlugin()
  assert.equal(magicHTML.render, defaultRenderDocument)
})

it('#apply will add the result of calling #render as an asset called `index.html`', (done) => {
  const mahRender = () => 'Foo'
  const magicHTML = new MagicHTMLPlugin({ render: mahRender })

  const mockCompilation = {
    assets: {},
    outputOptions: { publicPath: '/' },
    getStats () {
      return {
        toJson () { return { assetsByChunkName: {} } }
      }
    }
  }

  const mockCompiler = {
    plugin (_, callback) {
      callback(mockCompilation, () => {
        assert.equal(
          mockCompilation.assets['index.html'].source(),
          'Foo'
        )
        done()
      })
    }
  }

  magicHTML.apply(mockCompiler)
})

it('#apply will pass assets from chunks the provided render method', (done) => {
  let assetsPassed = []
  const mahRender = ({ assets }) => {
    assetsPassed = assets
    return ''
  }
  const magicHTML = new MagicHTMLPlugin({ render: mahRender })

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
          assetsPassed,
          ['/main-123.css', '/main-123.js']
        )
        done()
      })
    }
  }

  magicHTML.apply(mockCompiler)
})

