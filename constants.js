const { join } = require('path')

const PROD = process.env.NODE_ENV === 'production'

const INPUT_DIR = join(process.cwd(), process.env.INPUT_DIR || 'source')

const stringToArray = (str = '') => (
  str.split(',').map((elem) => elem.trim())
)

const trimPath = (path = '') => (
  path.replace().replace(/^\/|\/$/g, '')
)

const ensureAbsolute = (path = '') => {
  if (!path) return '/'
  return `/${path}/`
}

const CLIENT_ENTRIES = stringToArray(process.env.CLIENT_ENTRIES || './client.js')
const SERVER_ENTRIES = stringToArray(process.env.SERVER_ENTRIES || './server.js')

const OUTPUT_DIR = join(process.cwd(), process.env.OUTPUT_DIR || './dist')

const BASE_URL = process.env.BASE_URL || ''
const BASE_PATH = trimPath(process.env.BASE_PATH || '')
const ASSETS_PATH = ensureAbsolute(trimPath(process.env.ASSETS_PATH || ''))

const PUBLIC_PATH = [
  BASE_URL,
  BASE_PATH,
  ASSETS_PATH
].filter((p) => !!p).join('')

module.exports = {
  PROD,
  CLIENT_ENTRIES,
  SERVER_ENTRIES,
  OUTPUT_DIR,
  INPUT_DIR,
  PUBLIC_PATH,
  ASSETS_PATH
}
