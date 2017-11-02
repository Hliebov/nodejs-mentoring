const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const router = require('./routes/routes');

const cookieParser = require('./middlewares/cookie-parser');
const queryParser = require('./middlewares/query-parser');

function logger(req,res,next){
	console.log(req.parsedQueries);
	console.log(req.parsedCookies);
	next();
}

app.use(cookieParser);
app.use(queryParser);
app.use(queryParser);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger);

app.use(router);

module.exports = app;