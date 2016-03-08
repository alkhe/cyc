import express from 'express';
import jade from 'jade';
import path from 'path';
import babelRequire from 'babel-require2';

// Error.stackTraceLimit = Infinity;

// path helper functions
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
import { makeHTMLDriver } from '@cycle/dom';

// create mock DOM driver
const DOM = makeHTMLDriver();

// takes a config and creates a server endpoint
let endpoint = ({ app, page, route }) => {
	const template = jade.compileFile(local('src/html', page));
	let program = babelRequire(local('src/js', app)).default;

	if (process.env.NODE_ENV !== 'production') {
		// register mvi file with hot rebuilder
		require('./hot').accept(app, next => { program = next; });
	}

	// Cycle.run main function
	const main = ({ DOM }) => ({ DOM: program(DOM) });

	router.get(route, (req, res, next) => {
		run(main, { DOM })
			.sources.DOM
			.forEach(ssr => {
				res.end(template({ ssr }));
			}, next);
	});
}

endpoint({
	app: './mvi.js',
	page: './index.jade',
	route: '/'
});

app
	.use(router)
	.use(express.static('./public'));

app.listen(port, 'localhost', err => {
	if (err) {
		return console.err(err);
	}
	log(`listening on http://localhost:${ port }`);
});
