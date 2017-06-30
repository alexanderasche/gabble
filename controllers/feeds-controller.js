const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (request, response) => {
  if (request.session.isAuthenticated === true) {
    response.redirect('/feed');
  }
  else {
    response.redirect('/login');
  }
});


router.get('/feed', (request, response) => {
  if (request.session.isAuthenticated === true) {
    response.render('feed', {username: request.session.username});
  }
  else {
    response.redirect('/login');
  }
});

module.exports = router;