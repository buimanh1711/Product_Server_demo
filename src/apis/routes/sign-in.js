const express = require('express')
const router = express.Router()
const controller = require('../controllers/SignInController')
const auth = require('../../middleware/auth')
const getUser = require('../../utils/getUser')

router.post('/', controller.index)
router.get('/', auth, getUser, controller.checkLogin)


module.exports = router