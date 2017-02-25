const express = require('express');
const router = express.Router();
const app = express();
const passport = require('passport');

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

function isAuthenticated(req, res, next) { //can change function name
  if (req.isAuthenticated()) {
    console.log('pass');
    username = req.user.username;
    loggedIn = true;
    next();
  } else {
    console.log('NOPE TRY AGAIN');
    req.flash("error-msg", "* please log in first");
    res.redirect(303, '/gallery/login');
    // next();
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

// router.get('/', getUsername, (req, res) => {
//   Gallery.findAll()
//   .then(function(photos) {
//     let mainPhoto = photos.splice(0, 1)[0].dataValues;
//     res.render('index', {
//       mainPhoto : mainPhoto,
//       photos : photos,
//       username : username,
//       loggedIn : loggedIn
//     });
//   });
// });

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

router.get('/secret', isAuthenticated, (req, res) => {
  res.send('this is my secret page');
});

router.post('/login',
  passport.authenticate('local',  {
    successRedirect: '/gallery',
    failureRedirect: '/gallery/login',
    failureFlash: true })
);

// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.redirect('/gallery/login');
//     }
//     req.logIn(user, function(err) {
//       if (err) {
//         return next(err);
//       }
//       username = user.username;
//       loggedIn = true;
//       return res.redirect('/gallery');
//     });
//   })(req, res, next);
// });


router.get('/logout', isAuthenticated, (req, res) => {
  console.log('logging out');
  loggedIn = false;
  req.logout();
  res.redirect('/gallery');
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
    // res.redirect('/gallery');
    req.flash("error-msg", "* SUCCESS!! Please log in");
    res.redirect('/gallery/login');
  })
  .catch(err => {
    errorMsg(req, res, err);
    res.redirect(303, '/gallery/newuser');
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
  // Gallery.find( { where: { id : `${req.params.id}` } })
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
  // Gallery.findById(`${req.params.id}`)
  // .then(function(photos) {
  //   res.render('edit', {
  //     photos : photos,
  //     username : username,
  //     loggedIn : loggedIn,
  //     messages: res.locals.messages()
  //   });
  // });
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
    console.log('YOU SUCKKKKK');
    errorMsg(req, res, err);
    res.redirect(303, `/gallery/${id}/edit/`);
  });
});

router.delete('/:id', isAuthenticated, (req, res) => {
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