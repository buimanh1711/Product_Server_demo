const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const middleware = (app) => {
  app.use(cors({ origin: 'https://mb1o4er.herokuapp.com', credentials: true }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../../public')))
  app.use(fileUpload())
}

module.exports = middleware