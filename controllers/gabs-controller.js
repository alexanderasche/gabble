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
    await models.messages.create({
      content: request.body.message,
      userId: request.session.userId
    });
    response.redirect('/');
  }
});

router.get('/gab/:id', async (request, response) => {
  var message = await models.messages.findOne({
    include: [models.users, models.likes],
    where: { id: request.params.id } 
  });
  var likers = await models.likes.findAll({
    include: [models.users],
    where: { messageId: request.params.id }
  })
  var model = {
    message: message,
    likecount: message.likes.length,
    likers: likers
  }
  response.render("gab", {username: request.session.username, message: message});
});

router.post('/gab/:id/like', async (request, response) => {
  var message = await models.messages.findOne({
    include: [models.users],
    include: [models.likes],
    where: { id: request.params.id } 
  });
  // if(message[0].id)
  // for (i = 0; )
  // await models.messages.create({
  //     content: request.body.message,
  //     userId: userInfo.id
  //   });
  response.redirect('/feed');
});

module.exports = router;