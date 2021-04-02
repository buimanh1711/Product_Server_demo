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
          req.err = 'NotFound(14_Cate)'
          next()
        }
      }) 
      .catch(err => {
        req.err = 'ServerErr(19_Cate)'
        next()
      })
  }
}

module.exports = new CategoryController()