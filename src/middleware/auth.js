const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  let token = req.cookies.userToken
  if (token) {
    try {
      let result = jwt.verify(token, 'mb1o4er');
      if (result) {
        req.userId = result._id
        next()
      } else {
        req.err = 'khong the xac thuc'
      }
    } catch(err) {
      req.err = 'loi decode'
      next('last')
    }
  } else {
    req.err = 'khong the lay token'
    next('last')
  }

}
