module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(401)
    return res.render('home')
  })
}
