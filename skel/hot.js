import c from 'chokidar';

const log = ::console.log;

export default hotmodules => {
	c.watch(Object.keys(hotmodules))
		.on('change', file => {
			delete require.cache[file];
			try {
				hotmodules[file](require(file).default);
				log(`reloaded ${ file }`);
			}
			catch (e) {
				log(e);
			}
		});
}
