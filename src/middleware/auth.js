const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  console.log(req)
  let token = req.cookies
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', req.cookies)
  res.json({
    status: false,
    message: `this is ${token}`
  })
  // if (token) {
  //   jwt.verify(token, 'mb1o4er', (err, result) => {
  //     if (err) {
  //       req.err = 'khong the xac thuc'
  //       return next('last')
  //     }
  //     req.userId = result._id
  //     next()
  //   })
  // } else {
  //   req.err = `err: ${token}`
  //   next('last')
  // }

}
