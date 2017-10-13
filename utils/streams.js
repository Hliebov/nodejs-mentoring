(function () {
	const fs = require('fs');
	const through = require('through2');
	const csv = require('csvtojson');
	const async = require('async');
	const path = require('path');
	const request = require('request');

	const HELP = 'help';
	const ACTION ='action';
	const FILE ='file';
	const PATH ='path';

	const CSS_PATH = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';

	let argv = require('minimist')(process.argv);
	let keys = Object.keys(argv).slice(1);
	let action = argv[ACTION] || argv[ACTION[0]];
	let filePath = argv[FILE] || argv[FILE[0]];
	let cssPath = argv[PATH] || argv[PATH[0]];

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
		case 'bundle-css':
			bundleCss(cssPath);
			break;
		default:
			printHelpMessage();
	}

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
			'Actions: "io", "transform-uppercase", "transform-csv", "transform-csv-file", "bundle-css" ' +
			'Has to have a least one argument!');
	}

	function bundleCss(directory) {
		fs.readdir(directory, (err, files) => {
			if (err) {
				console.error(err);
			}
			files = files.map(file => path.join(directory, file));
			async.map(files, fs.readFile, (err, results) => {
				if (err) {
					console.error(err);
				}
				request(CSS_PATH, function (error, response, body) {
					if (error) {
						return console.error(error);
					}
					results.push(body);
					fs.writeFile(directory + '/bundle.css', results.join("\n"), (err) => {
						if (err) {
							console.error(err);
						} else {
						}
					});
				});
			});
		});
	}

})();