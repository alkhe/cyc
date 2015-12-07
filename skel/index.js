import express from 'express';
import jade from 'jade';

// Error.stackTraceLimit = Infinity;

const log = ::console.log;

const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

const app = express();
const router = express.Router();

if (production) {
	log('[pro]');
	app.use(require('compression')());
}
else {
	log('[dev]');
	const config = require('./dev.babel').default,
		compiler = require('webpack')(config),
		dev = require('webpack-dev-middleware'),
		hot = require('webpack-hot-middleware');

	app.use(dev(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	})).use(hot(compiler));
}

const mvisrc = require.resolve('./src/js/mvi');
let mvi = require(mvisrc).default;

if (!production) {
	require('./hot').default({
		[mvisrc]: next => { mvi = next; }
	});
}

const template = jade.compileFile('./src/html/index.jade');

import { run } from '@cycle/core';
import { makeHTMLDriver } from '@cycle/dom';

const main = ({ DOM }) => ({ DOM: mvi(DOM) });
const DOM = makeHTMLDriver();

router.get('/', (req, res) => {
	run(main, { DOM })
		.sources.DOM
		.forEach(ssr => {
			res.end(template({ ssr }));
		});
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
