function validateSlackToken (req, res, next) {
  if (req.body.token === process.env.token) {
    next()
  } else {
    res.sendStatus(403)
  }
}

module.exports = validateSlackToken
