import c from 'chokidar';

const log = ::console.log;

export let make = dynamicRequire =>
	(filename, update) => {
		c.watch(require.resolve(filename))
			.on('change', file => {
				delete require.cache[file];
				try {
					log(`reloading ${ file }`);
					update(dynamicRequire(file, true));
					log(`reloaded ${ file }`);
				}
				catch (e) {
					log(e);
				}
			});
	}
