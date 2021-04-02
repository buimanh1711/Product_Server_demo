const AccountModel = require('../models/account')
const PostModel = require('../models/post')
const jwt = require('jsonwebtoken')
const fs = require('fs')

class MeController {

  index = (req, res, next) => {
    const { userId } = req
    PostModel.countDocuments({ author: userId })
      .then(resData => {
        if(resData) {
          res.json({
            status: true,
            posts: parseInt(resData)
          })
        }
      }) 

  }

  changeInfo = (req, res, next) => {
    const { userInfo } = req
    const data = req.body
    const oldPass = data.oldPass
    const newPass = data.newPass

    const newData = {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
    }

    let newToken

    if (oldPass && newPass) {
      if (oldPass.length > 0 && oldPass === userInfo.password) {
        newData.password = newPass
        newToken = jwt.sign({ _id: userInfo._id, username: userInfo.username, password: newPass }, 'mb1o4er') || null
      } else {
        req.err = 'ConfirmPassErr(41_Me)'
        next('last')
      }
    } 

    AccountModel.updateOne({
      _id: userInfo._id
    }, newData)
      .then(resData => {
        if (resData) {
          res.json({
            status: true,
            newInfo: newData,
            newToken
          })
        } else {
          req.err = 'ChangeInfoErr(57_Me)'
          next('last')
        }
      })
      .catch(err => {
        req.err = 'ServerErr(62_Me)'
        next('last')
      })

  }

  changeAvt = (req, res, next) => {
    const { userInfo } = req
    const data = req.body || {}
    const path = data.image || null

    AccountModel.updateOne({
      _id: userInfo._id
    }, {
      image: path
    })
      .then(resData => {
        if (resData) {
          res.json({
            status: true,
            newImage: path
          })
        }
      })
  }
}

module.exports = new MeController()