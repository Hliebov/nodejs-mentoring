const express = require('express');
const router = express.Router();
const passport = require('passport');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const authCheck = require('./../middlewares/auth');

const Products = require('./../controllers/Products');
const Users = require('./../controllers/Users');

const User = require('./../models').User;
const Product = require('./../models').Product;

const citySchema = require('./../_models/city');

mongoose.connect('mongodb://localhost:27017/mentoring');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

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

router.get('/city', (req, res, next) => {
	//task 4 - using native driver:
	// MongoClient.connect("mongodb://localhost:27017/mentoring", function(err, db) {
	// 	if(err) { return console.error(err); }
	// 	db.collection('cities').aggregate(
	// 		[ { $sample: { size: 1 } } ], (err, item) => {
	// 			res.send(item);
	// 		}
	// 	)
	// });

	//task 6 - using mongoose:
	let City = mongoose.model('City', citySchema);
	City.count().exec(function(err, count){
		if(err) { return console.error(err); }
		let random = Math.floor(Math.random() * count);

		City.findOne().skip(random).exec(
			function (err, city) {
				if(err) { return console.error(err); }
				res.send(city);
			});
	});
});


module.exports = router;