// MODULES
var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
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

// SERVER START
app.listen(process.env.PORT || 3000, (req, res) => {
  console.log('Listening');
});
