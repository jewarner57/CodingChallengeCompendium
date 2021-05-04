const { expect } = require('chai');
const Challenge = require('../models/challenge');
const Solution = require('../models/solution')

module.exports = (app) => {
  // GET filtered challenges
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

  // GET a challenge by ID
  app.get('/challenges/:id', (req, res) => {
    Challenge.findById(req.params.id)
      .then((challenge) => {
        res.send(challenge)
      })
      .catch((err) => {
        console.log(err.message);
      });
  })

  // CREATE a challenge
  app.post('/challenges/', (req, res) => {
    if (!req.user) {
      res.status(401)
      return res.json({ message: 'not authorized' })
    }
    // Create a solution from given test solutions
    const solution = new Solution({ testsolutions: req.body.testsolutions })
    // Modify the challenge object to have the solution id
    const newChallengeObject = req.body
    newChallengeObject.testsolutionsID = solution._id
    // Create the new challenge
    const challenge = new Challenge(req.body)
    challenge.author = req.user._id

    solution.save().then(() => {
      challenge.save()
        .then((newChall) => res.json({ challenge: newChall }))
        .catch((err) => {
          throw err.message
        })
    })
  })

  // UPDATE a challenge
  app.put('/challenges/:id', (req, res) => {
    if (!req.user) {
      res.status(401)
      return res.json({ message: 'not authorized' })
    }

    Challenge.findOne({ _id: req.params.id })
      .then((challenge) => {
        // If the challenge author matches the current user
        if (String(challenge.author) === String(req.user._id)) {
          // Update the post with the new data
          Challenge.findByIdAndUpdate(req.params.id, req.body)
            // Find the updated challenge and send it back
            .then(() => Challenge.findOne({ _id: req.params.id }))
            .then((challenge) => {
              res.json({ challenge })
            })
            .catch((err) => {
              throw err.message
            })
        } else {
          res.status(401)
          return res.json({ message: 'not authorized' })
        }
      })
      .catch((err) => {
        throw err.message
      })
  })

  // SOLVE a challenge
  app.post('/challenges/:id/solve', (req, res, next) => {
    if (!req.user) {
      res.status(401)
      return res.json({ message: 'not authorized' })
    }

    Challenge.findById(req.params.id)
      .then((challenge) => {
        // The users attempt
        const solution = req.body.attempt
        // The solution object id
        const solutionID = challenge.testsolutionsID
        let solved = true

        // Get the solution object
        Solution.findById(solutionID)
          .then((expected) => {
            // For each solution
            for (let i = 0; i < solution.length; i += 1) {
              // check if it equals the challenge solution
              if (JSON.stringify(expected.testsolutions[i]) !== JSON.stringify(solution[i])) {
                // If it doesnt match, send index of test it failed on and user friendly message
                solved = false
                res.send({
                  success: false,
                  failedOn: i,
                  message: `expected: ${expected.testsolutions[i]}, but recieved: ${solution[i]}`,
                })
              }
            }
            // If all matches were found send success
            if (solved) {
              res.send({ success: true })
            }
          })
          .catch((err) => {
            console.log(err.message)
            throw err.message
          })
      })
      .catch((err) => {
        console.log(err.message);
      });
  })

  // DELETE a challenge
  app.delete('/challenges/:id', (req, res) => {
    if (!req.user) {
      res.status(401)
      return res.json({ message: 'not authorized' })
    }

    Challenge.findOne({ _id: req.params.id })
      .then((challenge) => {
        // If the challenge author matches the current user
        if (String(challenge.author) === String(req.user._id)) {
          // Find the challenge and delete it
          Challenge.findByIdAndDelete(req.params.id).then((result) => {
            if (result === null) {
              return res.json({ message: 'Challenge does not exist.' })
            }
            return res.json({
              message: 'Successfully deleted.',
              _id: req.params.id,
            })
          })
            .catch((err) => {
              throw err.message
            })
        } else {
          res.status(401)
          return res.json({ message: 'not authorized' })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(404)
        res.json({ message: 'challenge not found' })
      })
  })
}
