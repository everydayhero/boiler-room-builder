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

  it('applies custom headers', () => {
    const createApp = require('../app')
    const runner = () => Promise.resolve({
      headers: { Foo: 'bar' },
      body: '{ "foo": "bar" }'
    })

    const app = createApp({
      enableLogging: false,
      staticDir: '/public',
      runner
    })

    return request(app)
      .get('/')
      .expect('Foo', 'bar')
  })

  it('allows specifying status code', () => {
    const createApp = require('../app')
    const runner = () => Promise.resolve({
      status: 418,
      body: '{ "foo": "bar" }'
    })

    const app = createApp({
      enableLogging: false,
      staticDir: '/public',
      runner
    })

    return request(app)
      .get('/')
      .expect(418)
  })

  it('uses body for response, if result is omitted', () => {
    const createApp = require('../app')
    const runner = () => Promise.resolve({
      body: 'bar'
    })

    const app = createApp({
      enableLogging: false,
      staticDir: '/public',
      runner
    })

    return request(app)
      .get('/')
      .expect('bar')
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

  it('should apply middlewares', () => {
    const createApp = require('../app')

    const testMiddleware = (req, res, next) => {
      res.setHeader('X-This-Worked', 'This worked!')
      next()
    }

    const secondTestMiddleware = (req, res, next) => {
      res.setHeader('X-This-Too', 'This worked too!')
      next()
    }

    const runner = () => Promise.resolve({
      body: 'bar'
    })

    const app = createApp({
      enableLogging: false,
      staticDir: 'public',
      runner,
      middlewares: [testMiddleware, secondTestMiddleware]
    })

    return request(app)
      .get('/middleware/me')
      .expect('X-This-Worked', 'This worked!')
      .expect('X-This-Too', 'This worked too!')
  })
})
