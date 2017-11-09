const express = require('express');
const router = express.Router();

const Products = require('./../controllers/Products');
const Users = require('./../controllers/Users');

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

router.get('/api/users', (req, res, next) => {
	let users = Users.getAll();
	res.end(JSON.stringify(users));
});


module.exports = router;