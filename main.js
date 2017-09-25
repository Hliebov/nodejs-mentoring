const config = require('./config/config');
const models = require('./models');
const Importer = require('./importer');

console.log(config.name);

let user = new models.User();
let product = new models.Product();

let importer = new Importer();

// import data using async method:
importer.import('./data/').then((data) => {
	console.log(data);
}, (err) => {
	console.log(err);
});

// import data using sync method:
let data = importer.importSync('./data/');

console.log(data);