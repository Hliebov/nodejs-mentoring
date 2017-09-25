let events = require('events');
let fs = require('fs');
let csv = require('csvtojson');

class DirWatcher {
	constructor() {
		this.eventEmitter = new events.EventEmitter();
	}

	watch(path, delay) {
		let fsTimeout;

		fs.watch(path, (eventType, filename) => {
			if (fsTimeout) {
				clearTimeout(fsTimeout);
			}

			let self = this;

			fsTimeout = setTimeout(() => {
				console.log(`event type is: ${eventType}`);
				if (filename) {
					csv()
						.fromFile(path + filename)
						.on('end_parsed', function(jsonArrayObj) {
							self.eventEmitter.emit('dirwatcher:changed', null, jsonArrayObj);
						});
				} else {
					console.log('filename not provided');
				}
			}, delay);
		});
	}
}

module.exports = DirWatcher;