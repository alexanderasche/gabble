const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/users/:username', async (request, response) => {
  if (request.session.isAuthenticated === true) {
    var user = await models.users.findOne({ 
      attributes: ["id"],
      where: {username: request.params.username}
    });
    var messages = await models.messages.findAll({ 
      include: [
        models.users,
        { 
          model: models.likes, 
          include: [models.users]
        }
      ],
      where: {userId: user.id}
    });
    response.render("user", {username: request.session.username, messages: messages});
  }
  else {
    reponse.redirect('/');
  }
});

module.exports = router;