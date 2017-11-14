const express = require('express');
const bodyParser = require('body-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy  = require('passport-twitter').Strategy;

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

app.use(passport.initialize());

passport.use(new LocalStrategy((username, password, done) => {
	if(Users.validateUser(username, password)) {
		return done(null, username);
	}
}));

// passport.use(new GoogleStrategy({
// 		clientID:    config.googleAuth.clientID,
// 		clientSecret: config.googleAuth.clientSecret,
// 		callbackURL: config.googleAuth.callbackURL,
// 		passReqToCallback   : true
// 	},
// 	function(request, accessToken, refreshToken, profile, done) {
// 		if(Users.validateUser(username, password)) {
// 			return done(null, username);
// 		}
// 	}
// ));
//
// passport.use(new FacebookStrategy({
// 		clientID: config.facebookAuth.clientID,
// 		clientSecret: config.facebookAuth.clientSecret,
// 		callbackURL: config.facebookAuth.callbackURL
// 	},
// 	function(token, refreshToken, profile, done) {
// 		if(Users.validateUser(username, password)) {
// 			return done(null, username);
// 		}
// 	})
// );

// passport.use(new TwitterStrategy({
// 		consumerKey: config.twitterAuth.clientID,
// 		consumerSecret: config.twitterAuth.clientSecret,
// 		callbackURL: config.twitterAuth.callbackURL
// 	},
// 	function(token, refreshToken, profile, done) {
// 		if(Users.validateUser(username, password)) {
// 			return done(null, username);
// 		}
// 	})
// );

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.use(cookieParser);
app.use(queryParser);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger);

app.use(router);

module.exports = app;