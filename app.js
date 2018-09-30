// MODULES
var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  bcrypt = require('bcryptjs'),
  app = express();

// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + 'public'));

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

app.get('/secret', (req, res) => {
  res.render('secret');
});

app.get('/logout', (req, res) => {
  res.send('Logout route');
});

// POST ROUTES
app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, function(err, user) {
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (!result) {
        res.send('Nope');
      } else {
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
          console.log(user);
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
