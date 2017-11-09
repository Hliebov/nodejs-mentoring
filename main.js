const config = require('./config/config');
const models = require('./models');
const Importer = require('./importer');

require('./utils/streams');

console.log(config.name);

const user = new models.User();
const product = new models.Product();

const importer = new Importer();

// import data using async method:
importer.import('./data/').then((data) => {
	console.log(data);
}, (err) => {
	console.log(err);
});

// import data using sync method:
let data = importer.importSync('./data/');

console.log(data);