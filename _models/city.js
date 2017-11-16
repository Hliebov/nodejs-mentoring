const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
	name: String,
	country: String,
	capital: Boolean,
	location: {
		lat: Number,
		long: Number
	}
});

module.exports = citySchema;