function cookieParser(req,res,next){

	let cookies = req.headers.cookie;
	let parsedCookies = {};
	cookies && cookies.split(';').forEach((cookie) => {
		let nameValue = cookie.split('=');
		parsedCookies[nameValue[0]] = nameValue[1];
	});

	req.parsedCookies = parsedCookies;

	next();
}

module.exports = cookieParser;