const DirWatcher = require('./dirwatcher');
const sync = require('sync');
let dirwatcher = new DirWatcher();
let DELAY = 1000;

class Importer {
	constructor() {
		this.dirwatcher = new DirWatcher();
	}

	import(path) {
		this.dirwatcher.watch(path, DELAY);

		return new Promise((resolve, reject) => {
			this.dirwatcher.eventEmitter.once('dirwatcher:changed', (err, data) => {
				if(err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	importSync(path) {
		let result;
		this.dirwatcher.watch(path, DELAY);
		this.dirwatcher.eventEmitter.on('dirwatcher:changed', (err, data) => {
			if(err) {
				result = err;
			} else {
				result = data;
			}
		});
		while(result === undefined) {
			require('deasync').runLoopOnce();
		}
		return result;
	}
}

module.exports = Importer;