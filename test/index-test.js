require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server.js')

const { assert } = chai

const User = require('../models/user.js')
const Challenge = require('../models/challenge.js')

chai.config.includeStack = true

const { expect } = chai
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

describe('Challenge API Endpoints', () => {
  let challengeId = ''

  beforeEach((done) => {
    const sampleChallenge = new Challenge({
      name: 'sample challenge',
      difficulty: 1,
      description: 'a sample challenge',
      testcases: [[1, 3], [4, 6], [90, 94]],
      testsolutions: [[1, 2, 3], [4, 5, 6], [90, 91, 92, 93, 94]],
    })
    challengeId = sampleChallenge._id

    const sampleUser = new User({
      username: 'my username',
      password: 'my password',
    })

    sampleChallenge.save().catch((err) => { console.log(err) })
    sampleUser.save().catch((err) => { console.log(err) })

    done()
  })

  afterEach((done) => {
    Challenge.deleteMany({ name: ['sample challenge'] })
      .then(() => {
        User.deleteMany({ username: ['my username'] })
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
    chai.request(app)
      .get('/challenges')
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')

        done()
      })
  })

  it('should get a challenge by id', (done) => {
    chai.request(app)
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

  // it('should get filtered list of challenges', (done) => {
  //   chai.request(app)
  //     .get('/challenges?q="challenge"&difficulty="1')
  //     .end((err, res) => {
  //       if (err) { done(err) }
  //       expect(res).to.have.status(200)
  //       expect(res.body.challenges).to.be.an("array")

  //       done()
  //     })
  // })

  it('should solve a challenge', (done) => {
    const solutionsArr = { attempt: [[1, 2, 3], [4, 5, 6], [90, 91, 92, 93, 94]] }
    chai.request(app)
      .get(`/challenges/${challengeId}/solve?solutions=${JSON.stringify(solutionsArr)}`)
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
    const solutionsArr = { attempt: [0] }

    // this needs to be a post request
    // chai.request(app)
    //   .get(`/challenges/${challengeId}/solve?solutions=${JSON.stringify(solutionsArr)}`)
    //   .end((err, res) => {
    //     if (err) { done(err) }
    //     expect(res).to.have.status(200)
    //     expect(res.body).to.be.an('object')
    //     expect(res.body.success).to.equal(false)
    //     expect(res.body.failedOn).to.not.equal(undefined)

    //     done()
    //   })
  })
})
