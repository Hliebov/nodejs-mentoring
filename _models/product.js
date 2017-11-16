const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	reviews: Array({
		review: Number
	})
});

module.exports = productSchema;