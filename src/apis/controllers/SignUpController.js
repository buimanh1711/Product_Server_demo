const AccountModel = require('../models/account')
const jwt = require('jsonwebtoken')

class SignUnController {

  index = (req, res, next) => {
    let data = req.body
    let newAccount = new AccountModel(data)
    let username = data.username || null

    AccountModel.findOne({ username })
      .then((dataRes, something) => {
        if (!dataRes) {
          
          newAccount.save((err) => {
            if (err === null) {
              let id = newAccount._id
              let image = newAccount.image
              let username = newAccount.username
              let password = newAccount.password
              let token = jwt.sign({ _id: id, username: username, password }, 'mb1o4er') || null

              res.json({
                logged: true,
                userData: {
                  firstName: newAccount.firstName || null,
                  lastName: newAccount.lastName || null,
                  id,
                  image,
                  bio: newAccount.bio
                },
                token
              })
            }
          })
        } else {
          res.json({
            logged: false
          })
        }
      })
  }
}

module.exports = new SignUnController()