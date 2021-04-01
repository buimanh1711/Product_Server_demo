const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  let token = req.cookies ? req.cookies.userToken : null
  if (token) {
    jwt.verify(token, 'mb1o4er', (err, result) => {
      if (err) {
        req.err = 'khong the xac thuc'
        return next('last')
      }
      req.userId = result._id
      next()
    })
  } else {
    req.err = `err: ${token}`
    next('last')
  }

}
