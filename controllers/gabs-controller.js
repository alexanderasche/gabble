const express = require('express');
const router = express.Router();
const models = require('../models');

// router.get('/gab', function(request, response) {
//   response.render('gab');
// });

router.get('/gab/new', function(request, response) {
  response.render('gab-new');
});

module.exports = router;