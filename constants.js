const { join } = require('path')

const PROD = process.env.NODE_ENV === 'production'

const INPUT_DIR = join(process.cwd(), 'source')

const CLIENT_ENTRIES = ['./client.js']
const SERVER_ENTRIES = ['./server.js']

const OUTPUT_DIR = join(process.cwd(), 'dist')
const CLIENT_OUTPUT_DIR = OUTPUT_DIR
const SERVER_OUTPUT_DIR = OUTPUT_DIR

const PUBLIC_PATH = join(
  process.env.BASE_URL || '',
  process.env.BASE_PATH || '',
  process.env.ASSET_PATH || ''
)

module.exports = {
  PROD,
  CLIENT_ENTRIES,
  SERVER_ENTRIES,
  CLIENT_OUTPUT_DIR,
  SERVER_OUTPUT_DIR,
  INPUT_DIR,
  PUBLIC_PATH
}
