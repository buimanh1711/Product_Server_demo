const SiteModel = require('../models/siteInfor')

class SiteController {

  index = (req, res, next) => {
    SiteModel.find({})
            .then(data => {
                res.json(data)
            })
            .catch(err => res.send(err))
  }
}

module.exports = new SiteController()