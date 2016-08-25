const test = require('ava')
const MagicHTMLPlugin = require('../')
const defaultRenderDocument = require('../../../lib/default-render-document')

test('#constructor takes a render function option', (t) => {
  const mahRender = () => 'Foo'
  const magicHTML = new MagicHTMLPlugin({ render: mahRender })
  t.is(magicHTML.render, mahRender)
})

test('#contructor defaults the render option to defaultRenderDocument', (t) => {
  const magicHTML = new MagicHTMLPlugin()
  t.is(magicHTML.render, defaultRenderDocument)
})

test('#apply will add the result of calling #render as an asset called `index.html`', (t) => {
  t.plan(1)

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
        t.is(
          mockCompilation.assets['index.html'].source(),
          'Foo'
        )
      })
    }
  }

  magicHTML.apply(mockCompiler)
})

test('#apply will pass assets from chunks the provided render method', (t) => {
  t.plan(1)

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
        t.deepEqual(
          assetsPassed,
          ['/main-123.css', '/main-123.js']
        )
      })
    }
  }

  magicHTML.apply(mockCompiler)
})

