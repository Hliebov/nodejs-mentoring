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

console.dir(keys);

transformFile(filePath);

function inputOutput(path) {
	fs.createReadStream(path)
		.pipe(process.stdout);
}

function transformFile(path) {
	fs.createReadStream(path)
		.pipe(through(function (chunk, enc, callback) {
			let self = this;
			csv()
				.fromString(chunk.toString())
				.on('json',(json)=>{
					console.log(json)
					self.push(JSON.stringify(json));
				});

			callback()
		}))
		.pipe(fs.createWriteStream('out.json'))
		.on('finish', function () {
			console.log('JSON successfully created!')
		})
}

function transform() {
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

function httpClient() {

}
function httpServer() {

}
function printHelpMessage() {
	console.log('Available commands: --file (-f) --action (-a) --help (-h). Has to have a least one argument!');
}