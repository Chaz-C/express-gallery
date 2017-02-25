const express = require('express');
const router = express.Router();
const app = express();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const db = require('../models');
const { Gallery } = db;
const { User } = db;

let username;
let loggedIn = false;

function errorMsg(req, res, err) {
  for (let i = 0; i < err.errors.length; i++) {
    req.flash("error-msg", err.errors[i].message);
  }
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    username = req.user.username;
    loggedIn = true;
    next();
  } else {
    req.flash("error-msg", "* please log in first");
    res.redirect(303, '/gallery/login');
  }
}

function getUsername(req, res, next) {
  if (req.user) {
    username = req.user.username;
    loggedIn = true;
    next();
  } else {
    next();
  }
}

router.get('/', getUsername, (req, res) => {
  Gallery.findAll( {
    order : [['updatedAt', 'DESC']]
  })
  .then(function(photos) {
    let mainPhoto = photos.splice(0, 1)[0].dataValues;
    res.render('index', {
      mainPhoto : mainPhoto,
      photos : photos,
      username : username,
      loggedIn : loggedIn
    });
  });
});

router.get('/new', isAuthenticated, (req, res) => {
  Gallery.findAll()
  .then(photos => {
    photos = photos.splice(0, 3);
    res.render('new.hbs', {
      photos : photos,
      username: username,
      loggedIn: loggedIn,
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

// router.post('/newuser', (req, res) => {
//   User.create( {
//     username: req.body.username,
//     password: req.body.password
//   })
//   .then(function() {
//     req.flash("error-msg", "* SUCCESS!! Please log in");
//     res.redirect('/gallery/login');
//   })
//   .catch(err => {
//     errorMsg(req, res, err);
//     res.redirect(303, '/gallery/newuser');
//   });
// });

router.post('/newuser', (req, res) => {
  console.log('---NEW USER---', req.body.username);
  console.log('---NEW PW---', req.body.password);

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      console.log('hash', hash);
      User.create( {
        username: req.body.username,
        password: hash
      })
      .then(function() {
        req.flash("error-msg", "* SUCCESS!! Please log in");
        res.redirect('/gallery/login');
      })
      .catch(err => {
        errorMsg(req, res, err);
        res.redirect(303, '/gallery/newuser');
      });


    });
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

router.get('/:id', getUsername, (req, res) => {
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
      username : username,
      loggedIn : loggedIn
    });
  });
});

router.get('/:id/edit', isAuthenticated, (req, res) => {
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
      username : username,
      loggedIn : loggedIn,
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