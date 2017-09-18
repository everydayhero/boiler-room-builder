const request = require('supertest')

describe('app', () => {
  it('should return 200', () => {
    const createApp = require('../app')
    const runner = () => Promise.resolve({})
    const app = createApp({
      enableLogging: false,
      staticDir: '/public',
      runner
    })

    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')
  })

  it('should perform 301 redirects', () => {
    const createApp = require('../app')
    const redirectUrl = 'somewhereelse.com'
    const runner = () => Promise.resolve({ redirect: redirectUrl })
    const app = createApp({
      enableLogging: false,
      staticDir: '/public',
      runner
    })

    return request(app)
      .get('/')
      .expect(301)
      .expect('Location', redirectUrl)
      .expect('Cache-Control', 'no-cache')
  })

  it('should return 404', () => {
    const createApp = require('../app')
    const runner = () => Promise.reject(new Error('Not found'))
    const app = createApp({
      enableLogging: false,
      staticDir: '/public',
      runner
    })

    return request(app)
      .get('/are-you-the-droid-im-looking-for')
      .expect(404)
  })

  it('should return 500', () => {
    const createApp = require('../app')
    const runner = () => Promise.reject(new Error())
    const app = createApp({
      enableLogging: false,
      staticDir: '/public',
      runner
    })

    return request(app)
      .get('/mistakes-were-made')
      .expect(500)
  })
})
