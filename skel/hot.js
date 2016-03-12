import c from 'chokidar';
import babelRequire from 'babel-require2';
import path from 'path';

const log = ::console.log;

export let accept = (filename, options, update) => {
	c.watch(path.resolve(filename))
		.on('change', file => {
			delete require.cache[file];
			try {
				log(`reloading ${ file }`);
				update(babelRequire(file, options));
				log(`reloaded ${ file }`);
			}
			catch (e) {
				log(e);
			}
		});
}
