const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  console.log('this is cookies: ', req.cookies)
  let token = req.cookies ? req.cookies.userToken : null
  //ở đây nếu token đúng thì res về true ở next()
  if (token) {
    jwt.verify(token, 'mb1o4er', (err, result) => {
      if (err) {
        req.err = 'khong the xac thuc'
        //lỗi thì out 
        return next('last')
      }
      req.userId = result._id
      //k thì next()
      next()
    })
  } else {
    req.err = 'khong the lay token'
    next('last')
  }
}

module.exports = auth