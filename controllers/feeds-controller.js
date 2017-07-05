const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (request, response) => {
  if (request.session.isAuthenticated === true) {
    response.render('feed');
  }
  else {
    response.redirect('/login');
  }
});

router.get('/feed', async (request, response) => {
  if (request.session.isAuthenticated === true) {
    var messages = await models.messages.findAll({ 
      include: [
        models.users,
        { 
          model: models.likes, 
          include: [models.users]
        }
      ] 
    });
    for (i = 0; i < messages.length; i++) {
      if (messages[0].userId === request.session.userId) {
        messages[0].messageOwner = true;
      }
    }
    response.render('feed', {username: request.session.username, messages: messages});
  }
  else {
    response.redirect('/login');
  }
});

router.post('/feed/:id/like', async (request, response) => {
  var alreadyLiked = await models.likes.findOne({
    where: {userId: request.session.userId, messageId: request.params.id}
  });
  if (alreadyLiked) {
     await models.likes.destroy({
       where: { userId: request.session.userId, messageId: request.params.id }
     });
  }
  else {
    await models.likes.create({
      active: true,
      userId: request.session.userId,
      messageId: request.params.id
    });
  }
  response.redirect('/feed');
});

router.post('/feed/:id/delete', async (request, response) => {
  await models.messages.destroy({
    where: { id: request.params.id }
  });
  response.redirect('/feed');
});

router.get('/:id/likers', async (request, response) => {
  var likers = await models.messages.findOne({
    where: {id: request.params.id},
    include: [models.users],
  });
  response.render('likers', {likers: likers});
});

module.exports = router;