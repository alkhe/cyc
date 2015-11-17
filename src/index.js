let log = ::console.log;

let [,,arg] = process.argv;
if (arg === '-v' || arg === '--version') {
	console.log(require('../package.json').version);
	process.exit(0);
}

import { copySync as copy } from 'fs-extra';
import path from 'path';
import prompt from 'prompt';
import 'colors';
import replaceIn from './replaceIn';

const skel = path.resolve(__dirname, '../skel');

prompt.message = '';
prompt.delimiter = '';
prompt.start();

prompt.get({ name: 'name', description: 'Application Name'.blue, required: true }, (err, res) => {
	let { name } = res;
	prompt.get({ name: 'dir', description: 'Directory'.blue, default: name, required: true }, (err, res) => {
		let dir = path.resolve(res.dir);
		try {
			log('Copying...'.green);
			copy(skel, dir);
			log('Populating...'.green);
			replaceIn(dir, /--name--/g, name);
			log('Done.'.magenta);
		} catch (err) {
			log('Error: '.red + err);
		}
	});
});
