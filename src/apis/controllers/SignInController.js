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

          jwt.sign({ _id: id, username: data.username, password }, 'mb1o4er', { algorithm: 'RS256' }, function(err, token) {
            res.json({
              logged: true,
              userData: {
                role: resData.role || 'user',
                firstName: resData.firstName,
                lastName: resData.lastName,
                id,
                bio: resData.bio,
                image
              },
              userToken: token || 'abc'
            })
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
    res.json({
      status: true,
      username
    })
  }
}

module.exports = new SignInController()