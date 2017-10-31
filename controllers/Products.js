const mockProducts = [
	{id: '1', reviews: [{review: 1}]},
	{id: '2', reviews: [{review: 2}]},
	{id: '3', reviews: [{review: 3}]},
	{id: '4', reviews: [{review: 4}]}
];


Products = {
	getAll() {
		return mockProducts;
	},
	getById(id) {
		return mockProducts.find(p => p.id === id);
	},
	getReviewsById(id) {
		return this.getById(id).reviews;
	},
	addProduct() {
		let newProduct = {id: +new Date(), reviews: []};
		mockProducts.push(newProduct);
		return newProduct;
	}
};

module.exports = Products;