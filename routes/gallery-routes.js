const express = require('express');
const router = express.Router();
const app = express();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const errorMsg = require('../lib/error-msg');
const isAuthenticated = require('../lib/is-authenticated');
const getUser = require('../lib/get-user');

const db = require('../models');
const { Gallery } = db;
const { User } = db;

router.get('/', (req, res) => {
  let findUsername = getUser(req, res);
  Gallery.findAll( {
    order : [['updatedAt', 'DESC']]
  })
  .then(function(photos) {
    let mainPhoto = photos.splice(0, 1)[0].dataValues;
    res.render('index', {
      mainPhoto : mainPhoto,
      photos : photos,
      username : findUsername.username,
      loggedIn : findUsername.loggedIn
    });
  });
});

router.get('/new', isAuthenticated, (req, res) => {
  let findUsername = getUser(req, res);
  Gallery.findAll()
  .then(photos => {
    photos = photos.splice(0, 3);
    res.render('new.hbs', {
      photos : photos,
      username: findUsername.username,
      loggedIn: findUsername.loggedIn,
      messages: res.locals.messages()
    });
  });
});

router.get('/login', (req, res) => {
  Gallery.findAll()
  .then(photos => {
    photos = photos.splice(0, 3);
    res.render('login', {
      photos : photos,
      messages : res.locals.messages()
    });
  });
});

router.post('/login',
  passport.authenticate('local',  {
    successRedirect: '/gallery',
    failureRedirect: '/gallery/login',
    failureFlash: true })
);

router.get('/logout', isAuthenticated, (req, res) => {
  loggedIn = false;
  req.logout();
  res.redirect('/gallery');
});

router.get('/newuser', (req, res) => {
  Gallery.findAll()
  .then(photos => {
    photos = photos.splice(0, 3);
    res.render('newuser', {
      photos : photos,
      messages: res.locals.messages()
    });
  });
});

router.post('/newuser', (req, res) => {
  User.findOne( {
    where: {
      username : `${req.body.username}`
    }
  })
  .then(result => {
    if ( req.body.password === "" ) {
      req.flash("error-msg", "Please enter a username/password" );
      return res.redirect('/gallery/newuser');
    }
    if (result === null) {
      if ( req.body.password === req.body.password2 ) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            console.log('hash', hash);
            User.create( {
              username: req.body.username,
              password: hash
            })
            .then(function() {
              req.flash("error-msg", "SUCCESS!! Please log in");
              res.redirect('/gallery/login');
            })
            .catch(err => {
              errorMsg(req, res, err);
              res.redirect(303, '/gallery/newuser');
            });
          });
        });
      } else {
        req.flash("error-msg", "Passwords don't match");
        res.redirect('/gallery/newuser');
      }
    } else {
      req.flash("error-msg", "Username taken");
      res.redirect('/gallery/newuser');
    }
  })
  .catch(err => {
    res.send(err);
  });
});

router.post('/', isAuthenticated, (req, res) => {
  Gallery.create( {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  })
  .then(function () {
    res.redirect('/gallery');
  })
  .catch(err => {
    errorMsg(req, res, err);
    res.redirect(303, '/gallery/new');
  });
});

router.get('/:id', (req, res, next) => {
  let findUsername = getUser(req, res);
  Gallery.findAll( {
    order : [['updatedAt', 'DESC']]
  })
  .then(function(photos) {
    let mainPhoto = photos.filter( (element, index, array) => {
      if (element.dataValues.id === parseInt(req.params.id)) {
        return element;
      }
    })[0].dataValues;
    photos = photos.splice(0, 3);
    res.render('photo', {
      mainPhoto : mainPhoto,
      photos : photos,
      username : findUsername.username,
      loggedIn : findUsername.loggedIn
    });
  })
  .catch( err => {
    next();
  });
});

router.get('/:id/edit', isAuthenticated, (req, res) => {
  let findUsername = getUser(req, res);
  Gallery.findAll( {
    order : [['updatedAt', 'DESC']]
  })
  .then(function(photos) {
    let mainPhoto = photos.filter( (element, index, array) => {
      if (element.dataValues.id === parseInt(req.params.id)) {
        return element;
      }
    })[0].dataValues;
    photos = photos.splice(0, 3);
    res.render('edit', {
      mainPhoto : mainPhoto,
      photos : photos,
      username : findUsername.username,
      loggedIn : findUsername.loggedIn,
      messages : res.locals.messages()
    });
  });
});

router.put('/:id', isAuthenticated, (req, res) => {
  Gallery.update( {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
    },
    { where: {
        id: `${req.params.id}`
      }
    }
  )
  .then(function() {
    res.redirect(303, `/gallery/${req.params.id}`);
  })
  .catch(err => {
    let id = req.params.id;
    errorMsg(req, res, err);
    res.redirect(303, `/gallery/${id}/edit/`);
  });
});

router.delete('/:id', isAuthenticated, (req, res) => {
  Gallery.destroy( {
    where : {
      id: `${req.params.id}`
      }
    }
  )
  .then(function() {
    res.redirect(303, '/gallery');
  });
});

module.exports = router;