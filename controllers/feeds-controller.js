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
  // if (request.session.isAuthenticated === true) {
    var messages = await models.messages.findAll(
      { include: [models.users] }
    );
    console.log(messages);
    response.render('feed', {username: request.session.username, messages: messages});
  // }
  // else {
  //   response.redirect('/login');
  // }
});

module.exports = router;