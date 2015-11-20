import express from 'express';
import jade from 'jade';

let production = process.env.NODE_ENV === 'production';
let log = ::console.log;

let app = express();
let router = express.Router();

if (production) {
	log('[pro]');
	app.use(require('compression')());
}
else {
	log('[dev]');
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
let renderer = makeHTMLDriver();

const viewsource = require.resolve('./src/js/view');
let view = require(viewsource).default;

let template = jade.compileFile('./src/html/index.jade');

if (!production) {
	require('chokidar')
		.watch('./src/js/view.js')
		.on('change', () => {
			delete require.cache[viewsource];
			view = require(viewsource).default;
			log('[dev] reloaded view');
		});
}

router.get('/', (req, res) => {
	renderer(view().first())
		.first()
		.forEach(DOM => {
			res.end(template({ ssr: DOM }));
		});
});

app
	.use(router)
	.use(express.static('./public'));

const port = process.env.PORT || 3000;

app.listen(port, 'localhost', err => {
	if (err) {
		return console.err(err);
	}
	log(`listening on http://localhost:${ port }`);
});
