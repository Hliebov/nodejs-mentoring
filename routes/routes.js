const express = require('express');
const router = express.Router();
const passport = require('passport');

const jwt = require('jsonwebtoken');
const authCheck = require('./../middlewares/auth');

const Products = require('./../controllers/Products');
const Users = require('./../controllers/Users');

router.use('/api/products/*', authCheck);
router.use('/api/users/*', authCheck);

router.get('/api/products', (req, res) => {
	let products = Products.getAll();
	res.end(JSON.stringify(products));
});

router.get('/api/products/:id', (req, res, next) => {
	let product = Products.getById(req.params.id);
	res.end(JSON.stringify(product));
});

router.get('/api/products/:id/reviews', (req, res, next) => {
	let reviews = Products.getReviewsById(req.params.id);
	res.end(JSON.stringify(reviews));
});

router.post('/api/products', (req, res, next) => {
	let newProduct = Products.addProduct();
	res.end(JSON.stringify(newProduct));
});

router.get('/api/users', authCheck, (req, res, next) => {
	let users = Users.getAll();
	res.end(JSON.stringify(users));
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