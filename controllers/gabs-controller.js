const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/gab', (request, response) => {
  if (request.session.isAuthenticated === true) {
    response.render('post', {username: request.session.username});
  }
  else {
    response.redirect('/login');
  }
});

router.post('/gab', async (request, response) => {
  request.checkBody('message', 'Enter a gab.').notEmpty();
  request.checkBody('message', 'Your Gab is over 140 characters.').isLength({min: 1, max:140});
  validationErrors = request.validationErrors();
  if (validationErrors) {
    response.render('post', {errors: validationErrors})
  }
  else {
    var userInfo = await models.users.findOne({
      attributes: ['id'],
      where: { username: request.session.username }
    });
    await models.messages.create({
      content: request.body.message,
      userId: userInfo.id
    });
    response.redirect('/feed');
  }
});

router.get('/gab/:id', async (request, response) => {
  var messages = await models.messages.findOne({
    include: [models.users],
    where: { id: request.params.id } 
  });
  response.render("gab", {username: request.session.username, messages: messages});
});

router.get('gab/:id/like', async (request, response) => {
  var messages = await models.messages.findOne({
    include: [models.users],
    where: { id: request.params.id } 
  });
  response.render("gab", {username: request.session.username, messages: messages});
});

module.exports = router;