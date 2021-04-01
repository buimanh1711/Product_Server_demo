
const jwt = require('jsonwebtoken')

const getUser = (req, res, next) => {
  let token = req.headers?.authorization?.split(' ')[1]

  if (token) {
    let result = jwt.verify(token, 'mb1o4er')
    if (result) {
      req.userInfo = result
      next()
    } else {
        req.err = 'loi dang nhap'
        next('last')
    }
  }
}

module.exports = getUser