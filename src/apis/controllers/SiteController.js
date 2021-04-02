const SiteModel = require('../models/siteInfor')

class SiteController {

  index = (req, res, next) => {
    SiteModel.find({})
            .then(data => {
              if(data) {
                res.json({
                  status: true,
                  site: data[0]
                })
              }
            })
            .catch(err => res.send(err))
  }
}

module.exports = new SiteController()