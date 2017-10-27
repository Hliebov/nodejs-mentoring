let http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200);
	req.on('data',function(message){
		res.write(message);
	});
	req.on('end',function(){
		res.end();
	});
}).listen(9999);
