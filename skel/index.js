import express from 'express';
import jade from 'jade';
import path from 'path';
import babelRequire from 'babel-require2';

global.CLIENT = false;

// Error.stackTraceLimit = Infinity;

// helper functions
const here = process.cwd();
const local = (...paths) => path.join(here, ...paths);

const log = ::console.log;

const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();

if (process.env.NODE_ENV === 'production') {
	log('[pro]');
	app.use(require('compression')());
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
}

import { run } from '@cycle/core';

// takes a config and creates a server endpoint
let endpoint = ({ app, page, route }) => {
	app = local('src/js', app);
	page = local('src/html', page);
	const template = jade.compileFile(page);
	let { source, drivers } = babelRequire(app);

	let program = babelRequire(source).default;

	if (process.env.NODE_ENV !== 'production') {
		// register program with hot rebuilder
		require('./hot').accept(source, m => { program = m.default; });
	}

	router.get(route, (req, res, next) => {
		log(`GET ${ req.path }`);
		run(program, drivers)
			.sources.DOM
			.forEach(ssr => {
				res.end(template({ ssr }));
			}, next);
	});
}


// server configs
[{
	app: './index.js',
	page: './index.jade',
	route: '/'
}].forEach(endpoint);

app
	.use(router)
	.use(express.static('./public'));

app.listen(port, 'localhost', err => {
	if (err) {
		return console.err(err);
	}
	log(`listening on http://localhost:${ port }`);
});
