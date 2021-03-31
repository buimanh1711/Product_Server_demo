const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Account = new Schema({
  username: { type: String, maxLength: 69 },
  password: { type: String, maxLength: 30 },
  email: { type: String, maxLength: 100 },
  firstName: { type: String, maxLength: 30 },
  lastName: { type: String, maxLength: 30 },
  role: { type: String, default: 'user' },
  bio: { type: String, default: 'Create your bio'},
  image: { type: String, default: 'user_default.jpg'}
})

module.exports = mongoose.model('account', Account)