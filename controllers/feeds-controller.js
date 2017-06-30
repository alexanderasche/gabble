const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/feed', function(request, response) {
  response.render('feed');
});

module.exports = router;