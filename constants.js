const { join } = require('path')

const PROD = process.env.NODE_ENV === 'production'

const INPUT_DIR = process.env.INPUT_DIR || join(process.cwd(), 'source')

const stringToArray = (str = '') => (
  str.split(',').map((elem) => elem.trim())
)

const CLIENT_ENTRIES = stringToArray(process.env.CLIENT_ENTRIES || './client.js')
const SERVER_ENTRIES = stringToArray(process.env.SERVER_ENTRIES || './server.js')

const OUTPUT_DIR = process.env.OUTPUT_DIR || join(process.cwd(), 'dist')
const CLIENT_OUTPUT_DIR = process.env.CLIENT_OUTPUT_DIR || OUTPUT_DIR
const SERVER_OUTPUT_DIR = process.env.SERVER_OUTPUT_DIR || OUTPUT_DIR

const BASE_URL = process.env.BASE_URL || ''
const BASE_PATH = process.env.BASE_PATH || ''
const ASSET_PATH = process.env.ASSET_PATH || ''

const PUBLIC_PATH = [
  BASE_URL,
  BASE_PATH,
  ASSET_PATH
].filter((p) => !!p).join('') + '/'

module.exports = {
  PROD,
  CLIENT_ENTRIES,
  SERVER_ENTRIES,
  CLIENT_OUTPUT_DIR,
  SERVER_OUTPUT_DIR,
  INPUT_DIR,
  PUBLIC_PATH,
  ASSET_PATH
}
