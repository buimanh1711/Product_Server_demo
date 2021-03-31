const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
  title: { type: String, maxLength: 255 },
  description: { type: String, maxLength: 600 },
  content: { type: String },
  image: { type: String },
  createDate: { type: Date, default: Date.now },
  author: { type: String, ref: 'account' },
  category: { type: String, ref: 'category' },
  slug: { type: String, maxLength: 255 },
  newCate: { type: String },
  like: { type: Array, default: []},
  source: { type: String },
  comment: { type: Array, default: [] }
})

module.exports = mongoose.model('post', Post)