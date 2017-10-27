let http = require('http');

const product = {
	id: 1,
	name: 'Supreme T-Shirt',
	brand: 'Supreme',
	price: 99.99,
	options: [{color: 'blue'}, {size: 'XL'}]
};

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'JSON'});
	res.end(JSON.stringify(product));
}).listen(9999);