const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const middleware = (app) => {
  app.use(cors({ origin: 'http://localhost:3999', preflightContinue: true, credentials: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS" }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../../public')))
  app.use(fileUpload())
}

module.exports = middleware