import { version } from '../package.json';

const log = ::console.log;

const [,,arg] = process.argv;
if (arg === '-v' || arg === '--version') {
	log(version);
	process.exit(0);
}

log(`cyc v${ version }`.cyan);

import { copySync as copy } from 'fs-extra';
import path from 'path';
import prompt from 'prompt';
import 'colors';
import replace_in from './replace-in';

const skel = path.resolve(__dirname, '../skel');

prompt.message = '';
prompt.delimiter = '';
prompt.start();

prompt.get({ name: 'name', description: 'Application Name'.blue, required: true }, (err, res) => {
	const { name } = res;
	prompt.get({ name: 'dir', description: 'Directory'.blue, default: name, required: true }, (err, res) => {
		const dir = path.resolve(res.dir);
		try {
			log('Copying...'.green);
			copy(skel, dir);
			log('Populating...'.green);
			replace_in(dir, /--name--/g, name);
			log('Done.'.magenta);
		} catch (err) {
			log('Error: '.red + err);
		}
		process.exit(0);
	});
});
