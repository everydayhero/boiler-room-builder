const { describe, it } = require('mocha')
const assert = require('assert')

describe('Running tests', () => {
  it('runs test', () => {
    const x = 'Hey'
    assert.equal('Hey', x)
  })
})
