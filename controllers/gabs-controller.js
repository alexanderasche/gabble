const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/gab/new', function(request, response) {
  if (request.session.isAuthenticated = true) {
    response.render('gab-new');
  }
  else {
    response.redirect('/login');
  }
});

module.exports = router;