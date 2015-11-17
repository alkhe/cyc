import {
	readdirSync as rd,
	renameSync as rn,
	statSync as stat,
	readFileSync as rf,
	writeFileSync as wf
} from 'fs-extra';
import path from 'path';

// replace all instances of `find` in `dir` with `replace`
let replaceIn = (dir, find, replace) => {
	rd(dir).forEach(c => {
		let oldName = path.join(dir, c);
		if (c !== 'node_modules') {
			let name = oldName.replace(find, replace);
			rn(oldName, name);
			if (stat(name).isDirectory()) {
				replaceIn(name, find, replace);
			}
			else {
				wf(name, rf(name, 'utf8').replace(find, replace));
			}
		}
	});
};

export default replaceIn;
