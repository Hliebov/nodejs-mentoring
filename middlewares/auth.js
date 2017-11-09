const jwt = require('jsonwebtoken');

function authCheck(req, res, next) {
	jwt.verify(req.headers.token, 'secret', function(err, decoded) {
		if (err) {
			res.end('Access denied');
		} else if (decoded.signed) {
			next();
		} else {
			res.end('Unxpected error occured!')
		}
	});
}

module.exports = authCheck;