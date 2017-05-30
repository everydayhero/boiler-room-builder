const jsdom = require('jsdom')

global.document = jsdom.jsdom('<html><body></body></html>')
global.window = document.defaultView
global.navigator = window.navigator

// properties must be extracted from a document that was created that does not
// use a vm context.
const properties = Object.getOwnPropertyNames(
  jsdom.jsdom('', { features: { ProcessExternalResources: false } }).defaultView
)

// Attach all window properties to global, so things like HTMLElement are in
// scope. See https://github.com/sinonjs/sinon/issues/1377
properties.forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property]
  }
})
