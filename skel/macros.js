let Restart = source => `
let { run } = require('@cycle/core');
let { rerunner } = require('cycle-restart');

let rerun = rerunner(run);
rerun(main, drivers);

if (module.hot) {
	require('webpack-hot-middleware/client');
	module.hot.accept(() => {
		main = require('${ source }').default;
		rerun(main, drivers);
	});
}
`;

export default { Restart }
