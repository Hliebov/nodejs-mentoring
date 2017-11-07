const url = require('url');

function queryParser(req,res,next){

	// let parsedQueries = {};
	// let queryParams = req.url.split('?')[1];
	// queryParams && queryParams.split('&').forEach((queryParam) => {
	// 	let part = queryParam.split('=');
	// 	parsedQueries[part[0]] = part[1];
	// });
	//
	// req.parsedQueries = parsedQueries;
	req.parsedQueries = url.parse;

	next();
}

module.exports = queryParser;