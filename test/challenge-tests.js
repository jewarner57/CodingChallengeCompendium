require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server.js')

const { assert } = chai

const User = require('../models/user.js')
const Challenge = require('../models/challenge.js')
const Solution = require('../models/solution.js')

chai.config.includeStack = true

const { expect } = chai
const should = chai.should()
chai.use(chaiHttp)

const agent = chai.request.agent(app)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  agent.close()
  done()
})

describe('Challenge API Endpoints', () => {
  let challengeId = ''
  let challengeId2 = ''
  let userId = ''

  beforeEach((done) => {
    const sampleUser = new User({
      email: 'user@test.com',
      password: 'mypassword',
    })

    userId = sampleUser._id

    const sampleSolution = new Solution(
      { testsolutions: [[1, 2, 3], [4, 5, 6], [90, 91, 92, 93, 94]] },
    )

    const sampleChallenge = new Challenge({
      name: 'sample challenge',
      difficulty: 1,
      description: 'a sample challenge',
      testcases: [[1, 3], [4, 6], [90, 94]],
      testsolutionsID: sampleSolution._id,
      author: sampleUser._id,
    })
    challengeId = sampleChallenge._id

    const sampleSolution2 = new Solution({ testsolutions: [0] })

    const sampleChallenge2 = new Challenge({
      name: 'just-another-problem',
      difficulty: 10,
      description: 'a problem',
      testcases: [0],
      testsolutionsID: sampleSolution2._id,
      author: sampleUser._id,
    })

    challengeId2 = sampleChallenge2._id

    sampleSolution.save()
      .then(() => { sampleSolution2.save() })
      .then(() => { sampleChallenge.save() })
      .then(() => { sampleChallenge2.save() })
      .then(() => { sampleUser.save() })
      .then(() => {
        agent
          .post('/login')
          .send({ email: sampleUser.email, password: sampleUser.password })
          .then(() => { done() })
      })
  })

  afterEach((done) => {
    Challenge.deleteMany({ name: ['sample challenge', 'just-another-problem', 'A created challenge'] })
      .then(() => {
        User.deleteMany({ email: ['user@test.com'] })
          .then(() => {
            done()
          }).catch((err) => {
            done(err)
          })
      }).catch((err) => {
        done(err)
      })
  })

  it('should get all challenges', (done) => {
    agent
      .get('/challenges')
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')

        done()
      })
  })

  it('should get a challenge by id', (done) => {
    agent
      .get(`/challenges/${challengeId}`)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body.name).to.equal('sample challenge')
        expect(res.body.difficulty).to.equal(1)

        done()
      })
  })

  it('should get filtered list of challenges by difficulty', (done) => {
    agent
      .get('/challenges?difficulty=10')
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].difficulty).to.equal(10)

        done()
      })
  })

  it('should get filtered list of challenges by name', (done) => {
    agent
      .get('/challenges?q=problem')
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].name).to.contain('just-another-problem')
        expect(res.body[0].difficulty).to.equal(10)

        done()
      })
  })

  it('should solve a challenge', (done) => {
    const solutionsArr = JSON.stringify({ attempt: [[1, 2, 3], [4, 5, 6], [90, 91, 92, 93, 94]] })
    agent
      .post(`/challenges/${challengeId}/solve`)
      .set('content-type', 'application/json;charset=UTF-8')
      .send(solutionsArr)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body.success).to.equal(true)
        expect(res.body.failedOn).to.equal(undefined)

        done()
      })
  })

  it('should fail to solve a challenge', (done) => {
    const solutionsArr = JSON.stringify({ attempt: [0] })
    agent
      .post(`/challenges/${challengeId}/solve`)
      .set('content-type', 'application/json;charset=UTF-8')
      .send(solutionsArr)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body.success).to.equal(false)
        expect(res.body.failedOn).to.not.equal(undefined)

        done()
      })
  })

  it('should create a challenge', (done) => {
    const newChallenge = {
      name: 'A created challenge',
      difficulty: 5,
      description: 'some description',
      testcases: [0],
      testsolutions: [0],
    }
    agent
      .post('/challenges/')
      .send(newChallenge)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body.challenge.name).to.equal(newChallenge.name)

        Challenge.findOne({ _id: res.body.challenge._id })
          .then((challenge) => {
            expect(challenge.name).to.equal(newChallenge.name)
            expect(String(challenge.author)).to.equal(String(userId))
            done()
          })
          .catch((err) => {
            done(err)
          })
      })
  })

  it('should update a challenge', (done) => {
    agent
      .put(`/challenges/${challengeId}`)
      .send({ difficulty: 8 })
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body.challenge).to.be.an('object')
        expect(res.body.challenge).to.have.property('difficulty', 8)

        // check that the challenge is actually inserted into database
        Challenge.findOne({ _id: challengeId }).then((chall) => {
          expect(chall).to.be.an('object')
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('should fail to update a challenge', (done) => {
    chai.request(app)
      .put(`/challenges/${challengeId}`)
      .send({ difficulty: 8 })
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(401)
        done()
      })
  })

  it('should delete a challenge', (done) => {
    agent
      .delete(`/challenges/${challengeId}`)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal('Successfully deleted.')
        expect(res.body._id).to.equal(String(challengeId))

        // check that challenge is actually deleted from database
        Challenge.findOne({ _id: challengeId }).then((challenge) => {
          expect(challenge).to.equal(null)
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('should fail to delete a challenge', (done) => {
    chai.request(app)
      .delete(`/challenges/${challengeId}`)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(401)
        done()
      })
  })
})
