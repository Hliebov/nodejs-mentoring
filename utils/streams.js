const fs = require('fs');
const through = require('through2');
const csv = require('csvtojson')

const HELP = 'help';
const ACTION ='action';
const FILE ='file';

let argv = require('minimist')(process.argv);
let keys = Object.keys(argv).slice(1);
let action = argv[ACTION] || argv[ACTION[0]];
let filePath = argv[FILE] || argv[FILE[0]];

if (keys.indexOf(HELP) === 1 || keys.indexOf(HELP[0]) === 1) {
	printHelpMessage();
	return;
}

if (keys.length < 1) {
	printHelpMessage();
}

switch(action) {
	case 'io':
		inputOutput(filePath);
		break;
	case 'transform-uppercase':
		transformToUpperCase();
		break;
	case 'transform-csv':
		transformToJson(filePath);
		break;
	case 'transform-csv-file':
		transformFileToJson(filePath);
		break;
	default:
		printHelpMessage();
}

transformToJson(filePath);

function inputOutput(path) {
	fs.createReadStream(path)
		.pipe(process.stdout);
}

function transformFileToJson(path) {
	let fileName = path.split('.')[0];
	fs.createReadStream(path)
		.pipe(through(function (chunk, enc, callback) {
			csv()
				.fromString(chunk.toString())
				.on('json',(json)=>{
					this.push(JSON.stringify(json));
				});

			callback()
		}))
		.pipe(fs.createWriteStream(`${fileName}.json`))
		.on('finish', function () {
			console.log('JSON successfully created!')
		})
}

function transformToJson(path) {
	fs.createReadStream(path)
		.pipe(through(function (chunk, enc, callback) {
			csv()
				.fromString(chunk.toString())
				.on('json',(json)=>{
					this.push(JSON.stringify(json));
				});

			callback()
		}))
		.pipe(process.stdout);
}

function transformToUpperCase() {
	let stream = through(write, end);
	function write (buffer, encoding, next) {
		this.push(buffer.toString().toUpperCase());
		next();
	}

	function end (done) {
		done();
	}

	process.stdin
		.pipe(stream)
		.pipe(process.stdout);
}

function printHelpMessage() {
	console.log('Available commands: --file (-f) --action (-a) --help (-h). ' +
		'Actions: "io", "transform-uppercase", "transform-csv", "transform-csv-file". ' +
		'Has to have a least one argument!');
}