const express = require('express');
const bodyParser = require('body-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const router = require('./routes/routes');

const Users = require('./controllers/Users');

const cookieParser = require('./middlewares/cookie-parser');
const queryParser = require('./middlewares/query-parser');

function logger(req,res,next){
	console.log(req.parsedQueries);
	console.log(req.parsedCookies);
	next();
}

passport.use(new LocalStrategy((username, password, done) => {
	console.log(username);
	if(Users.validateUser(username, password)) {
		return done();
	}
	console.log('User validation failed!');
}));

app.use(cookieParser);
app.use(queryParser);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger);

app.use(router);

module.exports = app;