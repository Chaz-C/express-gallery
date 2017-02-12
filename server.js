const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

const db = require('./models');
const gallery = require('./routes/gallery-routes.js');

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index');
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

app.use(cookieParser('keyboard cat'));
app.use(session({ secret: 'yes'}));
app.use(flash());

app.use(function (req, res, next) {
  res.locals.message = require('express-messages')(req, res);
  next();
});

app.use('/gallery', gallery);



app.listen(PORT, () => {
  console.log('Server listening on', PORT);
  db.sequelize.sync();
});

module.exports = app;