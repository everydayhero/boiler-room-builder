module.exports = ({ headerValue }) => {
  return (req, res, next) => {
    res.setHeader('X-Test-Header', headerValue)
    next()
  }
}
