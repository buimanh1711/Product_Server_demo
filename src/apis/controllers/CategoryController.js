const CategoryModel = require('../models/category')

class CategoryController {
  //[GET] get all categories
  index = (req, res, next) => {
    CategoryModel.find({})
      .then(resData => {
        if(resData && resData.length > 0) {
          res.json({
            status: true,
            categories: resData
          })
        } else {
          req.err = 'Server error'
          next()
        }
      }) 
      .catch(err => {
        req.err = err
        next()
      })
  }
}

module.exports = new CategoryController()