const express = require('express');
const router = express.Router();
const passport = require('passport');

const jwt = require('jsonwebtoken');
const authCheck = require('./../middlewares/auth');

const Products = require('./../controllers/Products');
const Users = require('./../controllers/Users');

const User = require('./../models').User;
const Product = require('./../models').Product;

router.use('/api/products/*', authCheck);
router.use('/api/users/*', authCheck);

router.get('/api/products', (req, res) => {
	return Product
		.all()
		.then(products => res.status(200).send(products))
		.catch(error => res.status(400).send(error));
});

router.get('/api/products/:id', (req, res, next) => {
	Product.findById(req.params.id)
		.then(product => res.status(201).send(product))
		.catch(error => res.status(400).send(error));
});

router.post('/api/products', (req, res, next) => {
	Product.create({
		reviews: [{review: +Date.now()}]
	})
		.then(product => res.status(201).send(product))
		.catch(error => res.status(400).send(error));
});

router.get('/api/users', authCheck, (req, res, next) => {
	return User
		.all()
		.then(users => res.status(200).send(users))
		.catch(error => res.status(400).send(error));
});

router.post('/api/user', authCheck, (req, res, next) => {
	User.create({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password
	})
	.then(user => res.status(201).send(user))
	.catch(error => res.status(400).send(error));
});

router.post('/login',
	passport.authenticate('local', { failureRedirect: '/login' }),
	function(req, res) {
		res.end('Authentification is successful!')
});

router.get('/login/google',
	passport.authenticate('google', { scope:
		[
			'https://www.googleapis.com/auth/plus.login',
			'https://www.googleapis.com/auth/plus.profile.emails.read'
		]}
	));

router.get('/login/facebook',
	passport.authenticate('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

router.get('/login/twitter',
	passport.authenticate('twitter', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

router.get('/auth/facebook/callback', (req, res, next) => {
	res.end('Authenticated via facebook');
});

router.get('/auth/google/callback', (req, res, next) => {
	res.end('Authenticated via google');
});

router.get('/auth/twitter/callback', (req, res, next) => {
	res.end('Authenticated via twitter');
});

router.post('/auth', (req, res, next) => {
	if(Users.validateUser(req.body.name, req.body.password)) {
		let token = jwt.sign({ signed: true }, 'secret');
		res.end(JSON.stringify({
			"code": 200,
			"message": "OK",
			"data": {
				"user": {
					"email": "...",
					"username": "req.body.name"
				}},
			"token": token})
		)
	} else {
		res.end(JSON.stringify({
			"code": 404,
			"message": "Not found",
			"data": {}
			})
		)
	}
});


module.exports = router;