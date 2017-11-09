const http = require('http');
const fs = require('fs');

http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'html'});

	// task 1e-f:
	// let file = fs.readFileSync('http-servers/index.html');
	// res.end(file.toString().replace('{message}', 'Message'));

	fs.createReadStream('http-servers/index.html')
		.pipe(res)
		.on('error', function(err) {
			console.error(err);
		});


}).listen(9999);