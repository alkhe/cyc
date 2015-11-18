import express from 'express';
import jade from 'jade';

let production = process.env.NODE_ENV === 'production';

let app = express();
let router = express.Router();

if (production) {
	console.log('[pro]');
	app.use(require('compression')());
}
else {
	console.log('[dev]');
	let config = require('./dev.babel').default,
		compiler = require('webpack')(config),
		dev = require('webpack-dev-middleware'),
		hot = require('webpack-hot-middleware');

	app.use(dev(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	})).use(hot(compiler));
}

import { makeHTMLDriver } from '@cycle/dom';
import view from './src/js/view';
let renderer = makeHTMLDriver();

let template = jade.compileFile('./src/html/index.jade');
let iso = ssr => template({ ssr });

router.get('/', (req, res) => {
	renderer(view().first())
		.forEach(DOM => {
			res.end(iso(DOM));
		});
});

app
	.use(router)
	.use(express.static('./public'));

const port = process.env.PORT || 80;

app.listen(port, 'localhost', err => {
	if (err) {
		return console.err(err);
	}
	console.log(`listening on http://localhost:${ port }`);
});
