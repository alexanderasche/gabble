const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', function(request, response) {
  if (request.session.isAuthenticated = true) {
    response.redirect('/feed');
  }
  else {
    response.redirect('/login');
  }
});


router.get('/feed', function(request, response) {
  if (request.session.isAuthenticated = true) {
    response.render('feed');
  }
  else {
    response.redirect('/login');
  }
});

module.exports = router;