const Challenge = require('../models/challenge');

module.exports = (app) => {
  app.get('/challenges', (req, res) => {
    const name = req.query.q
    const diff = req.query.difficulty

    queryObject = {}
    if (name) {
      // If the challenge name contains the query string
      queryObject.name = { $regex: name, $options: 'i' }
    }
    if (diff) {
      // If the challenge difficulty matches
      queryObject.difficulty = diff
    }

    // Search for valid challenges and send them
    Challenge.find(queryObject)
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

  app.post('/challenges/:id/solve', (req, res, next) => {
    Challenge.findById(req.params.id)
      .then((challenge) => {
        const solution = req.body.attempt
        const challengeToSolve = challenge.testsolutions
        let solved = true

        // For each solution
        for (let i = 0; i < solution.length; i += 1) {
          // check if it equals the challenge solution
          if (JSON.stringify(challengeToSolve[i]) !== JSON.stringify(solution[i])) {
            // If it doesnt match, send index of test it failed on and user friendly message
            solved = false
            res.send({
              success: false,
              failedOn: i,
              message: `expected: ${challengeToSolve[i]}, but recieved: ${solution[i]}`,
            })
          }
        }

        // If all matches were found send success
        if (solved) { res.send({ success: true }) }
      })
      .catch((err) => {
        console.log(err.message);
      });
  })
}
