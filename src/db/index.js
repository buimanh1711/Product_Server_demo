const mongoose = require('mongoose')

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/demo_product', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    console.log('connect db successfully!')
  } catch(error) {
    console.log('connect db failed!')
  }
}

module.exports = { connect }