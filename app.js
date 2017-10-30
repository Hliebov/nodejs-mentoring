const express = require('express');

const app = express();

const cookieParser = require('./middlewares/cookie-parser');
const queryParser = require('./middlewares/query-parser');

function logger(req,res,next){
	console.log(req.parsedQueries);
	console.log(req.parsedCookies);
}

app.use(cookieParser);
app.use(queryParser);

app.use(logger);

module.exports = app;