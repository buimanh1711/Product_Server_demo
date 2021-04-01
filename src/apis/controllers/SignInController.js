const jwt = require('jsonwebtoken')
const AccountModel = require('../models/account')

class SignInController {

  index = (req, res, next) => {
    let data = req.body

    AccountModel.findOne({
      username: data.username,
      password: data.password
    })
      .then((resData, something) => {
        if (resData) {
          let id = resData._id
          let image = resData.image
          let password = resData.password

          let token = jwt.sign({ _id: id, username: data.username, password }, 'mb1o4er') 
            if(!token) {
              req.err = 'loi token'
              return next('last')
            }

            res.cookie('userToken', token, { httpOnly: true, sameSite: true, maxAge: 24 * 60 * 60 * 1000})
            console.log(token)
            return res.status(200).json({
              logged: true,
              userData: {
                role: resData.role || 'user',
                firstName: resData.firstName,
                lastName: resData.lastName,
                id,
                bio: resData.bio,
                image
              },
              // // userToken: token
          })

        } else {
          res.json({
            logged: false
          })
        }
      })
      .catch(err => {
        res.send(err)
      })
  }

  checkLogin = (req, res) => {
    const { userInfo } = req
    const { username } = userInfo
    //đoạn này nghĩa là nó auth thành công á :3
    res.json({
      status: true,
      username
    })
  }
}

module.exports = new SignInController()