const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  let token = req.headers?.authorization?.split(' ')[1]
  
  if (token) {
    jwt.verify(token, 'mb1o4er', (err, result) => {
      if (err) {
        req.err = 'unauthenticate'
        return next('last')
      }
      req.userId = result._id
      next()
    })
  } else {
    req.err = 'TokenErr'
    next('last')
  }
}

module.exports = auth