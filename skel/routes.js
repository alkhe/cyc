import { join } from 'path';

const localJoin = (...args) => './' + join(...args);
const appDir = 'src/js';
const pageDir = 'src/html';
const libDir = 'lib';

/* endpoint configs
app relative to ./src/js
page relative to ./src/html
*/
export default [{
	app: 'index.js',
	page: 'index.jade',
	route: '/'
}, {
	app: 'about.js',
	page: 'index.jade',
	route: '/about'
}].map(({ app, page, ...rest }) => ({
	lib: localJoin(libDir, app),
	app: localJoin(appDir, app),
	page: localJoin(pageDir, page),
	...rest
}));
