const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', function(request, response) {
  if (request.session.isAuthenticated === true) {
    response.redirect('/feed');
  }
  else {
    response.redirect('/login');
  }
});

router.get('/login', function(request, response) {
  if (request.session.isAuthenticated === true) {
    response.redirect('/');
  }
  else {
    response.render('login');
  }
});

router.post('/login', async function(request, response) {
  var usernamesPasswords = await models.user.findAll({attributes: ['username', 'password']});
  var usernameArray = [];
  var passwordArray = [];
  var validationErrors = [];
  for (i = 0; i < usernamesPasswords.length; i++) {
    usernameArray.push(usernamesPasswords[i].username.toLowerCase());
    passwordArray.push(usernamesPasswords[i].password);
  }
  var userIndex = usernameArray.indexOf(request.body.username);
  var passwordIndex = passwordArray.indexOf(request.body.password);
  if (!usernameArray.includes(request.body.username) || (userIndex != passwordIndex)) {
    validationErrors.unshift({"msg": "Invalid username and password."});
    response.render('login', {errors: validationErrors});
  }
  else {
    request.session.isAuthenticated = true;
    request.session.username = request.body.username;
    response.redirect('/');
  }
});

router.get('/register', function(request, response) {
  if (request.session.isAuthenticated === true) {
    response.redirect('/');
  }
  else {
    response.render('register');
  }
});

router.post('/register', async function(request, response) {
  var usernames = await models.user.findAll({attributes: ['username']});
  var usernameArray = [];
  var validationErrors = [];
  for (i = 0; i < usernames.length; i++) {
    usernameArray.push(usernames[i].username.toLowerCase());
  }
  request.checkBody('username', 'Enter a username.').notEmpty();
  request.checkBody('display_name', 'Enter a display name.').notEmpty();
  request.checkBody('password', 'Enter a password.').notEmpty();
  request.checkBody('confirm_password', 'Passwords do not match.').equals(request.body.password);
  validationErrors = request.validationErrors();
  if(usernameArray.includes(request.body.username)) {
    validationErrors.unshift({"msg": "That username is taken."}); 
  }
  if(validationErrors) {
    response.render('register', {errors: validationErrors});
  } 
  else {
    await models.user.create({
      username: request.body.username,
      displayname: request.body.display_name,
      password: request.body.password
    });
    request.session.isAuthenticated = true;
    request.session.username = request.body.username;
    response.redirect('/');
  }
});

router.get('/logout', function(request, response) {
  request.session.isAuthenticated = false;
  response.redirect('/');
});

module.exports = router;