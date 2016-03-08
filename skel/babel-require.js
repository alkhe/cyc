import fs from 'fs';
import path from 'path';
import * as babel from 'babel-core';

export default filename => {
	filename = path.resolve(filename);
	if (fs.existsSync(filename)) {
		let { code } = babel.transformFileSync(filename);
		let m = new module.constructor();
		console.log(m);
		let localModules = path.join(process.cwd(), 'node_modules');
		if ((m.paths || []).indexOf(localModules) < 0) {
			m.paths = [localModules].concat(m.paths);
		}
		console.log(m);
		m._compile(code, filename);
		return m.exports;
	}
}
