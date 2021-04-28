const Challenge = require('../models/challenge');

module.exports = (app) => {
  app.get('/challenges', (req, res) => {
    Challenge.find({})
      .then((challenges) => res.send(challenges))
      .catch((err) => console.log(err))
  })

  app.get('/challenges/:id', (req, res) => {
    Challenge.findById(req.params.id)
      .then((challenge) => {
        res.send(challenge)
      })
      .catch((err) => {
        console.log(err.message);
      });
  })

  app.post('/challenges/:id/solve', (req, res) => {
    Challenge.findById(req.params.id)
      .then((challenge) => {
        if (challengeToSolve.testsolutions === solution.attempt) {
          res.send({ success: true })
        } else {
          res.send({ success: false, failedOn: 'something' })
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  })
}
