const express = require('express');
const router = express.Router();
const app = express();
const passport = require('passport');

const db = require('../models');
const { Gallery } = db;
const { User } = db;

function errorMsg(req, res, err) {
  for (let i = 0; i < err.errors.length; i++) {
    req.flash("error-msg", err.errors[i].message);
  }
}

function isAuthenticated(req, res, next) { //can change function name
  if (req.isAuthenticated()) {
    console.log('pass');
    next();
  } else {
    console.log('YOU SUCK');
    res.redirect(303, '/gallery/login');
  }
}

let username;

router.get('/', (req, res) => {
  Gallery.findAll()
  .then(function(photos) {
    res.render('index', {
      photos : photos,
      username : username
    });
  });
});

router.get('/new', (req, res) => {
  res.render('new.hbs', {
    messages: res.locals.messages()
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/secret', isAuthenticated, (req, res) => {
  res.send('this is my secret page');
});

// router.post('/login',
//   passport.authenticate('local',  {
//     successRedirect: '/gallery/secret',
//     failureRedirect: '/gallery/login',
//     failureFlash: true })
// );

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/gallery/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      username = user.username;
      return res.redirect('/gallery/secret');
    });
  })(req, res, next);
});


router.get('/newuser', (req, res) => {
  res.render('newuser', {
    messages: res.locals.messages()
  });
});

router.post('/newuser', (req, res) => {
  User.create( {
    username: req.body.username,
    password: req.body.password
  })
  .then(function() {
    res.redirect('/gallery');
  })
  .catch(err => {
    errorMsg(req, res, err);
    res.redirect(303, '/gallery/newuser');
  });
});

router.post('/', (req, res) => {
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

router.get('/:id', (req, res) => {
  // Gallery.find( { where: { id : `${req.params.id}` } })
  Gallery.findById(`${req.params.id}`)
  .then(function(photo) {
    res.render('photo', {
      photo : photo,
      username: username
    });
  });
});

router.get('/:id/edit', (req, res) => {
  Gallery.findById(`${req.params.id}`)
  .then(function(photo) {
    res.render('edit', {
      photo : photo,
      messages: res.locals.messages()
    });
  });
});

router.put('/:id', (req, res) => {
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
    errorMsg(req, res, err);
    res.redirect(303, `/gallery/${req.params.id}/edit`);
  });
});

router.delete('/:id', (req, res) => {
  console.log("DELETED");
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