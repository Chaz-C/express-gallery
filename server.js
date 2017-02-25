const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const PORT = process.env.PORT || 3000;

const CONFIG = require('./config/config.json');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('./models');
const { Gallery } = db;
const { User } = db;
const gallery = require('./routes/gallery-routes.js');

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser('keyboard cat'));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(session({
  store: new RedisStore(),
  secret: CONFIG.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne( {
      where: {
        username: username,
        password: password
      }
    })
    .then(function(result) {
      if ( result === null ) {
        return done(null, false);
      } else {
        const user = {
          username: `${result.dataValues.username}`
        };
        return done(null, user);
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

app.get('/', (req, res) => {
  Gallery.findAll()
  .then(function(photos) {
  res.render('index', { photos : photos });
  });
});

app.use(express.static('public'));

app.use('/gallery', gallery);

app.listen(PORT, () => {
  console.log('Server listening on', PORT);
  db.sequelize.sync();
});

module.exports = app;