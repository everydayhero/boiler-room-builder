const request = require('supertest')

const createApp = require('../app')

describe('app', () => {
  it('should perform redirects', () => {
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
})
