const express = require('express')
const router = express.Router()
const controller = require('../controllers/SignUpController')

router.post('/', controller.index)


module.exports = router