require('dotenv').config();

const port = process.env.PORT
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(expressValidator());

require('./data/customAPI-db');

const checkAuth = (req, res, next) => {
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
  } else {
    const token = req.cookies.nToken;
    const decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

require('./controllers/challenges.js')(app);
require('./controllers/auth.js')(app);

app.listen(port, () => {
  console.log(`API listening on port http://localhost:${port}!`);
});

module.exports = app;
