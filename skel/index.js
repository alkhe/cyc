import express from 'express';
import jade from 'jade';

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

const template = jade.compileFile('./src/html/index.jade');

import { makeHTMLDriver } from '@cycle/dom';
const renderer = makeHTMLDriver();

const vsrc = require.resolve('./src/js/view'),
	msrc = require.resolve('./src/js/model'),
	isrc = require.resolve('./src/js/intent');

let view = require(vsrc).default,
	model = require(msrc).default,
	intent = require(isrc).default;

if (!production) {
	require('./hot').default({
		[vsrc]: next => { view = next; },
		[msrc]: next => { model = next; },
		[isrc]: next => { intent = next; }
	});
}

router.get('/', (req, res) => {
	renderer(view(model(intent({}))).first())
		.first()
		.forEach(DOM => {
			res.end(template({ ssr: DOM }));
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
