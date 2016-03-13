import express from 'express';
import jade from 'jade';
import { join } from 'path';
import makeRequire from 'dynamic-require';

global.CLIENT = false;

// Error.stackTraceLimit = Infinity;

// helper functions
const here = process.cwd();
const localJoin = (...args) => './' + join(...args);
const log = ::console.log;
const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();

let hotAccept;
const dynamicRequire = makeRequire(here, {
	ast: false,
	comments: false,
	compact: true
});

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
	hotAccept = require('./hot').make(dynamicRequire);
}

import { run } from '@cycle/core';

const appDir = 'src/js',
	pageDir = 'src/html';

// takes a config and creates a server endpoint
let endpoint = ({ app, page, route }) => {
	let lib = localJoin('lib', app);
	app = localJoin(appDir, app)
	page = localJoin(pageDir, page);

	const template = jade.compileFile(page);
	let { source, drivers } = dynamicRequire(app);
	source = localJoin(appDir, source);
	let program = dynamicRequire(source).default;

	if (process.env.NODE_ENV !== 'production') {
		// register program with hot rebuilder
		console.log(source);
		hotAccept(source, m => { program = m.default; });
	}

	router.get(route, (req, res, next) => {
		log(`GET ${ req.path }`);
		run(program, drivers)
			.sources.DOM
			.forEach(ssr => {
				res.end(template({ ssr, lib }));
			}, next);
	});
}


// server configs
[{
	app: './index.js',
	page: './index.jade',
	route: '/'
}, {
	app: './about.js',
	page: './index.jade',
	route: '/about'
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
