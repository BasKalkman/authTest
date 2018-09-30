// MODULES
var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  bcrypt = require('bcryptjs'),
  session = require('client-sessions'),
  app = express();

// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + 'public'));
app.use(
  session({
    cookieName: 'testAuth',
    secret: 'Long String for Test-Auth',
    duration: 1000 * 60 * 60 * 2,
    activeDuration: 1000 * 60 * 30,
    httpOnly: true,
    ephemeral: true
  })
);

// MIDDLEWARE
app.use(function(req, res, next) {
  if (req.testAuth && req.testAuth.user) {
    User.findOne({ username: req.testAuth.user.username }, (err, user) => {
      if (!user) {
        req.testAuth.reset();
        res.redirect('/login');
      } else {
        user.password = '';
        req.user = user;
        req.testAuth.user = user;
        res.locals.user = user;
        next();
      }
    });
  } else {
    next();
  }
});

function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

//MONGOOSE
mongoose.connect(
  'mongodb://localhost/auth-test',
  { useNewUrlParser: true }
);
var User = require('./models/User');

// ROUTES
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/secret', requireLogin, (req, res) => {
  res.render('secret');
});

app.get('/logout', (req, res) => {
  req.testAuth.reset();
  res.redirect('/');
});

// POST ROUTES
app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, function(err, user) {
    if (err) {
      res.redirect('/login', { error: 'Unknown username / password' });
    }
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (!result) {
        res.redirect('/login', { error: 'Unknown username / password' });
      } else {
        req.testAuth.user = user;
        res.redirect('/secret');
      }
    });
  });
});

app.post('/register', (req, res) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      User.create({ username: req.body.username, password: hash }, function(err, user) {
        if (err) {
          console.log(err);
          res.redirect('/register');
        } else {
          res.redirect('/login');
        }
      });
    });
  });
});

// SERVER START
app.listen(process.env.PORT || 3000, (req, res) => {
  console.log('Listening');
});
