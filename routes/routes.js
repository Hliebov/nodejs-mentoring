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
const productSchema = require('./../_models/product');
const userSchema = require('./../_models/user');

mongoose.connect('mongodb://localhost:27017/mentoring');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

router.use('/api/products/*', authCheck);
router.use('/api/users/*', authCheck);

router.get('/api/products', (req, res) => {
	let Product = mongoose.model('Product', productSchema);
	Product.find((err, products) => {
		if (err) return console.error(err);
		res.status(201).send(products);
	});
});

router.get('/api/products/:id', (req, res, next) => {
	let Product = mongoose.model('Product', productSchema);
	Product.findOne({_id: req.params.id}, (err, products) => {
		if (err) return console.error(err);
		res.status(201).send(products);
	});
});

router.post('/api/product', (req, res, next) => {
	let Product = mongoose.model('Product', productSchema);
	let product = new Product({
		reviews: [
			{
				review: +Date.now()
			}
		]
	});
	product.save((err, product) => {
		if (err) return console.error(err);
		res.status(201).send(product);
	});
});

router.get('/api/users', authCheck, (req, res, next) => {
	let User = mongoose.model('User', userSchema);
	User.find((err, users) => {
		if (err) return console.error(err);
		res.status(201).send(users);
	});
});

router.post('/api/user', authCheck, (req, res, next) => {
	let User = mongoose.model('User', userSchema);
	let user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password
	});
	user.save((err, user) => {
		if (err) return console.error(err);
		res.status(201).send(user);
	});
});

router.post('/login',
	passport.authenticate('local', { failureRedirect: '/login' }),
	(req, res) => {
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
	// MongoClient.connect("mongodb://localhost:27017/mentoring", (err, db) => {
	// 	if(err) { return console.error(err); }
	// 	db.collection('cities').aggregate(
	// 		[ { $sample: { size: 1 } } ], (err, item) => {
	// 			res.send(item);
	// 		}
	// 	)
	// });

	//task 6 - using mongoose:
	let City = mongoose.model('City', citySchema);

	let user = new User({
		firstName: 'Alex',
		lastName: 'Admin',
		email: 'email',
		password: 'pswd'
	});

	user.save();

	City.count().exec((err, count) => {
		if(err) { return console.error(err); }
		let random = Math.floor(Math.random() * count);

		City.findOne().skip(random).exec(
			 (err, city) => {
				if(err) { return console.error(err); }
				res.send(city);
			});
	});
});


module.exports = router;