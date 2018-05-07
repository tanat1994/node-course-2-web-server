const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// @dev get port from HEROKU and rewrite to port 3000
const port = process.env.PORT || 3000;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
// app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// @dev if put this line over the maintenenance.hbs => public/help.html can still access
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express</h1>');
  // res.send({
  //   name: 'Tanat',
  //   lastname: 'Wiri'
  // })
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeText: 'Welcome Back',
  });
});

app.get('/about', (req, res) => {
  // res.send({
  //   about: 'This is about page',
  //   return: 'This page return JSON'
  // });
  res.render('about.hbs', {
    pageTitle : 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

// @dev when deploy on HEROKU we need to change port to HEROKU port
// @previous app.listen(3001, () => .....)
app.listen(port, () => {
  console.log('Server is running on port ', port);
});
