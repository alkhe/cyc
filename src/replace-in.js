import {
	readdirSync as ls,
	renameSync as mv,
	statSync as stat,
	readFileSync as read,
	writeFileSync as write
} from 'fs-extra';
import path from 'path';

// replace all instances of `find` in `dir` with `replace`
const replaceIn = (dir, find, replace) => {
	ls(dir)
		.filter(x => x !== 'node_modules')
		.forEach(child => {
			const oldName = path.join(dir, child);
			const name = oldName.replace(find, replace);
			mv(oldName, name);
			if (stat(name).isDirectory()) {
				replaceIn(name, find, replace);
			}
			else {
				write(name, read(name, 'utf8').replace(find, replace));
			}
		});
};

export default replaceIn;
