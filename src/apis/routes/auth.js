const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const controller = require('../controllers/AuthController')

router.get('/', auth, controller.index)

module.exports = router