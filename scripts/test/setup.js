const jsdom = require('jsdom')

global.document = jsdom.jsdom('<html><body></body></html>')
global.window = document.defaultView
global.navigator = window.navigator
