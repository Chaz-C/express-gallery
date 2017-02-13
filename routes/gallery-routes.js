const express = require('express');
const router = express.Router();
const app = express();

const db = require('../models');
const { Gallery } = db;

function errorMsg(req, res, err) {
  for (let i = 0; i < err.errors.length; i++) {
    req.flash("error-msg", err.errors[i].message);
  }
}

router.get('/', (req, res) => {
  Gallery.findAll()
  .then(function(photos) {
    res.render('index', { photos : photos });
  });
});

router.get('/new', (req, res) => {
  res.render('new.hbs', { messages: res.locals.messages() });
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
    // req.flash("error-msg", err.errors[0].message);
    errorMsg(req, res, err);
    res.redirect(303, '/gallery/new');
  });
});

router.get('/:id', (req, res) => {
  // Gallery.find( { where: { id : `${req.params.id}` } })
  Gallery.findById(`${req.params.id}`)
  .then(function(photo) {
    res.render('photo', { photo : photo });
  });
});

router.get('/:id/edit', (req, res) => {
  Gallery.findById(`${req.params.id}`)
  .then(function(photo) {
    res.render('edit', { photo : photo });
  });
});

router.put('/:id', (req, res) => {
  Gallery.update(
  {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  },
  { where: { id: `${req.params.id}`}}
  )
  .then(function() {
    res.redirect(303, `/gallery/${req.params.id}`);
  });
});

router.delete('/:id', (req, res) => {
  Gallery.destroy(
    { where : { id: `${req.params.id}`}}
    )
  .then(function() {
    res.redirect(303, '/gallery');
  });
});

module.exports = router;