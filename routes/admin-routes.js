const express = require('express');
const router = express.Router();
const app = express();

const getUser = require('../lib/get-user');
const isAdmin = require('../lib/isAdmin');

const db = require('../models');
const { User } = db;

router.get('/', (req, res) => {
  let findUsername = getUser(req, res);
  res.render('users-list', {
    loggedIn : findUsername.loggedIn,
    username : findUsername.username
  });
});

module.exports = router;