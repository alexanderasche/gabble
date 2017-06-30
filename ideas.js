// Users

var user {
  username: string not null;
  password: string not null;
  display_name: string not null;
}

// Messages

var message = {
  content: string (140 max);
  user: userID;
}

// Likes

var like = {
  
}



router.post('/register', async function(request, response) {
  var usernames = await models.user.findAll({attributes: ['username']});
  var usernameArray = [];
  var validationErrors = [];
  for (i = 0; i < usernames.length; i++) {
    usernameArray.push(usernames[i].username.toLowerCase());
  }
  request.checkBody('username', 'Enter a username.').notEmpty();
  request.checkBody('display_name', 'Enter a display name.').notEmpty();
  request.checkBody('password', 'Enter a password.').notEmpty();
  request.checkBody('confirm_password', 'Passwords do not match.').equals(request.body.password);
  validationErrors = request.validationErrors();
  if(usernameArray.includes(request.body.username)) {
    validationErrors.unset({"msg": "That username is taken."}); 
  }
  if(validationErrors) {
    response.render('register', {errors: validationErrors});
  } 
  else {
    await models.user.create({
      username: request.body.username,
      displayname: request.body.display_name,
      password: request.body.password
    });
    response.redirect('/');
  }
});