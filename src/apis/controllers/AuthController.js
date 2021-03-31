class AuthController {

  index = (req, res) => {
    res.json({
      status: true
    })
  }

}

module.exports = new AuthController()