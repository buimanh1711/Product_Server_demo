const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = new Schema({
  postId: { type: String, ref: 'post' },
  content: { type: String },
  like: { type: Array, default: [] },
  user: { type: String, ref: 'account'},
  createDate: { type: Date, default: Date.now}
})

module.exports = mongoose.model('comment', Comment)