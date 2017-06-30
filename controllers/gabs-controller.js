const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/gab/new', (request, response) => {
  if (request.session.isAuthenticated === true) {
    response.render('gab-new', {username: request.session.username});
  }
  else {
    response.redirect('/login');
  }
});

module.exports = router;