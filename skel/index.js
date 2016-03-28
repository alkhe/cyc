import express from 'express';
import jade from 'jade';
import { babel } from 'dynamic-require';

global.CLIENT = false;

// Error.stackTraceLimit = Infinity;

// helper functions
const here = process.cwd();
const log = ::console.log;
const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();

let hashes = {};
let devopt = {};
const dynamicRequire = babel(here, {
	ast: false,
	comments: false,
	compact: true
});

if (process.env.NODE_ENV === 'production') {
	log('[pro]');
	app.use(require('compression')());
	let { readFileSync } = require('fs');
	hashes = JSON.parse(readFileSync('./hashes.json'));
}
else {
	log('[dev]');
	// use dev compilation and hot reloading
	const config = require('./dev.babel').default,
		compiler = require('webpack')(config),
		dev = require('webpack-dev-middleware'),
		hot = require('webpack-hot-middleware');

	app.use(dev(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	})).use(hot(compiler));
	devopt.hotAccept = require('./hot')
		.make(compiler, dynamicRequire, next => hashes = next);
}

let getFile = id => {
	let entry = hashes[id];
	return 'lib/' + (entry instanceof Array ? entry[0] : entry);
};

// takes a config and creates a server endpoint
let endpoint = ({ app, page, route, id }) => {
	const template = jade.compileFile(page);
	let program = dynamicRequire(app).default;
	let lib = getFile(id);

	if (process.env.NODE_ENV !== 'production') {
		// register program with hot rebuilder
		devopt.hotAccept(app, m => {
			program = m.default;
			lib = getFile(id);
		});
	}

	router.get(route, (req, res, next) => {
		log(`GET ${ req.path }`);
		program()
			.sources.DOM
			.forEach(ssr => {
				res.end(template({ ssr, lib }));
			}, next);
	});
}

import routes from './routes';
routes.forEach(endpoint);

app
	.use(router)
	.use(express.static('./public'));

app.listen(port, '::1', err => {
	if (err) {
		return console.err(err);
	}
	log(`listening on http://::1:${ port }`);
});
