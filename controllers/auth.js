const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (app) => {
  app.get('/users/:id', (req, res) => {
    if (!req.user) {
      res.status(401)
      return res.json({ message: 'not authorized' })
    }

    User.findOne({ _id: req.params.id })
      .then((user) => res.send(user))
      .catch((err) => console.log(err))
  })

  // SIGN UP POST
  app.post('/sign-up', (req, res) => {
    // Create User and JWT
    const newuser = new User(req.body);

    User.findOne({ email: newuser.email })
      .then((user) => {
        // If user already exists return an error
        if (user) { return res.status(409).send({ err: 'Email already in use.' }) }
        // save user and send token
        newuser
          .save()
          .then((user) => {
            const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            res.json({ user })
          })
          .catch((err) => {
            console.log(err.message);
            return res.status(400).send({ err });
          });
      })
      .catch((err) => {
        throw err
      })
  });

  // LOGOUT
  app.post('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.json({ message: 'Logout Successful' })
  });

  // LOGIN
  app.post('/login', (req, res) => {
    const { email } = req.body;
    const { password } = req.body;
    // Find this user name
    User.findOne({ email }, 'email password')
      .then((user) => {
        if (!user) {
          // User not found
          return res.status(401).send({ message: 'Wrong Email or Password' });
        }
        // Check the password
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            // Password does not match
            return res.status(401).send({ message: 'Wrong Email or password' });
          }
          // Create a token
          const token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET, {
            expiresIn: '60 days',
          });
          // Set a cookie
          res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
          res.json({ message: 'Login Successful' })
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // UPDATE a user's email
  app.put('/users/:id', (req, res) => {
    if (!req.user || String(req.user._id) !== req.params.id) {
      res.status(401)
      return res.json({ message: 'not authorized' })
    }

    User.findByIdAndUpdate(req.params.id, { email: req.body.email })
      .then(() => User.findOne({ _id: req.params.id }))
      .then((user) => {
        res.json({ user })
      })
      .catch((err) => {
        throw err.message
      })
  })

  // DELETE a user
  app.delete('/users/:id', (req, res) => {
    if (!req.user || String(req.user._id) !== req.params.id) {
      res.status(401)
      return res.json({ message: 'not authorized' })
    }

    User.findByIdAndDelete(req.params.id).then((result) => {
      if (result === null) {
        return res.json({ message: 'User does not exist.' })
      }
      return res.json({
        message: 'Successfully deleted.',
        _id: req.params.id,
      })
    })
      .catch((err) => {
        throw err.message
      })
  })
}
