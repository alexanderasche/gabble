const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (request, response) => {
  if (request.session.isAuthenticated === true) {
    var existingUser = await models.users.findOne({
      attributes: ["id"],
      where: { username: request.session.username }
    });
    request.session.userId = existingUser.id;
    response.redirect('/feed');
  }
  else {
    response.redirect('/login');
  }
});

router.get('/login', (request, response) => {
  if (request.session.isAuthenticated === true) {
    response.redirect('/');
  }
  else {
    response.render('login');
  }
});

router.post('/login', async (request, response) => {
  var username = request.body.username;
  var password = request.body.password;
  validationErrors = [];
  var existingUser = await models.users.findOne({
    where: { username: username, password: password }
  });
  if (!existingUser) {
    validationErrors.push({"msg": "Invalid username and password."}); 
    response.render('login', {errors: validationErrors});
  } 
  else {
    var userId = await models.users.findOne({
      attributes: ["id"],
      where: {username: request.body.username}
    });
    request.session.isAuthenticated = true;
    request.session.username = request.body.username;
    response.redirect('/');
  }
});

router.get('/register', (request, response) => {
  if (request.session.isAuthenticated === true) {
    response.redirect('/');
  }
  else {
    response.render('register');
  }
});

router.post('/register', async (request, response) => {
  var username = request.body.username.toLowerCase();
  var password = request.body.password;
  validationErrors = [];
  request.checkBody('username', 'Enter a username.').notEmpty();
  request.checkBody('display_name', 'Enter a display name.').notEmpty();
  request.checkBody('password', 'Enter a password.').notEmpty();
  request.checkBody('confirm_password', 'Passwords do not match.').equals(request.body.password);
  validationErrors = request.validationErrors();
  var existingUser = await models.users.findOne({
    where: { username: username }
  });
  if (existingUser || validationErrors) {
    if(existingUser) {
      validationErrors = [{"msg": "That username is taken."}];
    }
    response.render('register', {errors: validationErrors});
  }
  else {
    request.session.isAuthenticated = true;
    request.session.username = request.body.username;
    response.redirect('/');
  }
});

router.get('/logout', (request, response) => {
  request.session.destroy();
  response.redirect('/');
});

module.exports = router;