import c from 'chokidar';

export default hotmodules => {
	c.watch(Object.keys(hotmodules))
		.on('change', file => {
			delete require.cache[file];
			hotmodules[file](require(file).default);
			console.log(`[dev] reloaded ${ file }`);
		});
}
