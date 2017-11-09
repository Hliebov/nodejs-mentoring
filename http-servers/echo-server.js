let http = require('http');

http.createServer(function (req, res) {
	req.pipe(res);
}).listen(9999);
