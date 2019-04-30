const assert = require('assert')
const path = require('path')
const sinon = require('sinon')

const initialiseMiddlewares = require('../initialise-middlewares')

describe('initialiseMiddlewares', () => {
  it('should require and initialise a middleware via path', () => {
    const testConfig = {
      middlewares: [
        {
          middleware: path.join(__dirname, './example-middleware')
        }
      ]
    }

    const testResponse = {
      setHeader: sinon.stub()
    }

    const middlewares = initialiseMiddlewares(testConfig)

    assert(middlewares.length === 1)
    middlewares[0](null, testResponse, () => {})
    assert(testResponse.setHeader.calledWith('X-Test-Header', 'Test header'))
  })

  it('should initialise a middleware with provided options', () => {
    const testConfig = {
      middlewares: [
        {
          middleware: path.join(__dirname, './example-middleware-options'),
          options: {
            headerValue: 'Test value'
          }
        }
      ]
    }

    const testResponse = {
      setHeader: sinon.stub()
    }

    const middlewares = initialiseMiddlewares(testConfig)

    middlewares[0](null, testResponse, () => {})
    assert(testResponse.setHeader.calledWith('X-Test-Header', 'Test value'))
  })

  it('should pass through a middleware that is already a function', () => {
    const testConfig = {
      middlewares: [
        {
          middleware: (req, res, next) => {
            res.setHeader('X-Nobody-Knows', 'The trouble I\'ve seen')
            next()
          }
        }
      ]
    }

    const testResponse = {
      setHeader: sinon.stub()
    }

    const middlewares = initialiseMiddlewares(testConfig)

    middlewares[0](null, testResponse, () => {})
    assert(testResponse.setHeader
      .calledWith('X-Nobody-Knows', 'The trouble I\'ve seen'))
  })
})
