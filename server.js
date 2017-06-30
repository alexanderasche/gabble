const express = require('express');
const models = require('./models');
const handlebars = require('express-handlebars');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');

const application = express();
const port = 3000;

application.set('view engine', 'handlebars');
application.set('views', './views');
application.engine('handlebars', handlebars());

const authenticationController = require('./controllers/authentication-controller');
const feedsController = require('./controllers/feeds-controller');
const gabsController = require('./controllers/gabs-controller');

application.use(session({
    secret: 'gabble',
    resave: false,
    saveUninitialized: true,
}));

application.use(express.static('public'));
application.use(bodyParser.urlencoded({extended: true}));
application.use(bodyParser.json());
application.use(expressValidator());

application.use(authenticationController);
application.use(feedsController);
application.use(gabsController);

application.listen(port, () => {
});