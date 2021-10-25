// This module is INSECURE
const Module = require('module');
const http = require('http');
const path = require('path');

const exported = new Map();
let initialized = false;

module.exports = {
	connect: async (url) => {
		if (!initialized){
			let cpen322 = await new Promise((resolve, reject) => http.get(url, res => {
				let filename = 'cpen322.js';
				let data = '';
				res.setEncoding('utf8');
				res.on('data', chunk => data += chunk);
				res.on('end', () => {
					let cpen322 = new Module('', module.parent);
					cpen322.filename = filename;
					cpen322.paths = Module._nodeModulePaths(path.dirname(filename));
					cpen322._compile(data, filename);

					resolve(cpen322.exports);
				});
			}));
			cpen322.initialize({
				exported: exported
			});	
		}
		initialized = true;
	},
	export: (filename, dict) => {
		let scope = path.basename(filename);
		if (!exported.has(scope)) exported.set(scope, {});
		Object.assign(exported.get(scope), dict);
	}
}