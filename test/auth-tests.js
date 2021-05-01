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

let userId = ''

describe('User API endpoints', () => {
  // Create a sample user for use in tests.
  beforeEach((done) => {
    const sampleUser = new User({
      email: 'user@test.com',
      password: 'mypassword',
    })

    userId = sampleUser._id

    sampleUser.save()
      .then(() => {
        done()
      })
  })

  // Delete sample user.
  afterEach((done) => {
    User.deleteMany({ email: ['test@user.com', 'user@test.com', 'another@test.com', 'updatedUser@test.com'] })
      .then(() => {
        done()
      }).catch((err) => {
        done(err)
      })
  })

  it('should get one user by their id', (done) => {
    chai.request(app)
      .get(`/users/${userId}`)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body.email).to.equal('user@test.com')
        expect(res.body.password).to.equal(undefined)
        done()
      })
  })

  it('should create a new user', (done) => {
    chai.request(app)
      .post('/sign-up')
      .send({ email: 'another@test.com', password: 'mypassword' })
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body.user).to.be.an('object')
        expect(res.body.user).to.have.property('email', 'another@test.com')
        expect(res).to.have.cookie('nToken');

        // check that user is actually inserted into database
        User.findOne({ email: 'another@test.com' }).then((user) => {
          expect(user).to.be.an('object')
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('should update a user', (done) => {
    chai.request(app)
      .put(`/users/${userId}`)
      .send({ email: 'updatedUser@test.com' })
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body.user).to.be.an('object')
        expect(res.body.user).to.have.property('email', 'updatedUser@test.com')

        // check that user is actually inserted into database
        User.findOne({ email: 'updatedUser@test.com' }).then((user) => {
          expect(user).to.be.an('object')
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('should delete a user', (done) => {
    chai.request(app)
      .delete(`/users/${userId}`)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal('Successfully deleted.')
        expect(res.body._id).to.equal(String(userId))

        // check that user is actually deleted from database
        User.findOne({ email: 'updatedUser@test.com' }).then((user) => {
          expect(user).to.equal(null)
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  // TODO: LOGOUT TEST
  // TODO: LOGIN TEST
})
