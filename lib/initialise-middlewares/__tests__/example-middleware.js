module.exports = () => {
  return (req, res, next) => {
    res.setHeader('X-Test-Header', 'Test header')
    next()
  }
}
