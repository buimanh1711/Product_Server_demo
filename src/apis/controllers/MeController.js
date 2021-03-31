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

    if (oldPass) {
      if (oldPass.length > 0 && oldPass === userInfo.password) {
        newData.password = newPass
        newToken = jwt.sign({ _id: userInfo._id, username: userInfo.username, password: newPass }, 'mb1o4er') || null
      } else {
        req.err = 'sai mat khau cu'
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
          req.err = 'Khong the thay doi thong tin'
          next('last')
        }
      })
      .catch(err => {
        req.err = 'hollo bug'
        next('last')
      })

  }

  changeAvt = (req, res, next) => {
    const file = req.files?.file
    const { userInfo } = req
    const data = req.body || {}
    let path

    if (!file) {
      path = 'user_default.jpg'
    } else {
      path = `${file.name}`
      file.mv(`${__dirname}../../../../public/upload/${path}`)
    }

    AccountModel.updateOne({
      _id: userInfo._id
    }, {
      image: path
    })
      .then(resData => {
        if (resData) {
          if (data.oldFile && data.oldFile !== path && data.oldFile !== 'default_image.png' && data.oldFile !== 'user_default.jpg') {
            try {
              console.log('thanh cong')
              fs.unlinkSync(`${__dirname}../../../../public/upload/${data.oldFile}`)
            } catch (err) {
              console.log(err)
            }
          }
          res.json({
            status: true,
            newImage: path
          })
        }
      })
  }
}

module.exports = new MeController()