import { describe, it } from 'mocha'
import assert from 'assert'

describe('Running tests', () => {
  it('runs test', () => {
    const x = 'Hey'
    assert.strictEqual('Hey', x)
  })
})
